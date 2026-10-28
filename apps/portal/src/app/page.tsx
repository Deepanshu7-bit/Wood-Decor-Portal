"use client";

import React, { useState, useEffect } from "react";
import { UserRole } from "@woods-decor/types";
import {
  Users,
  Clock,
  ShieldCheck,
  Building2,
  Camera,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  employeeCode: string;
  phone: string;
  email?: string;
  role: string;
  department: string;
  branchId?: {
    _id: string;
    name: string;
    code: string;
  };
  shift: {
    startTime: string;
    minWorkHours: number;
    graceMinutes: number;
  };
  status: "active" | "inactive" | "resigned";
}

const API_BASE = "http://localhost:5000/api/v1";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"users" | "attendance" | "permissions">("users");
  const [selectedRole, setSelectedRole] = useState<UserRole>("super_admin");
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  const [staffList, setStaffList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // New Employee Form State
  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    phone: "",
    email: "",
    password: "",
    role: "sales_staff",
    department: "Sales",
    shiftStart: "09:30",
    graceMinutes: 15,
  });

  // Fetch employees from live backend API
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const json = await res.json();
        setStaffList(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load staff list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check backend health
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setBackendStatus("online");
          fetchEmployees();
        } else {
          setBackendStatus("offline");
          setLoading(false);
        }
      })
      .catch(() => {
        setBackendStatus("offline");
        setLoading(false);
      });

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          employeeCode: formData.employeeCode,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password || "woods123",
          role: formData.role,
          department: formData.department,
          shift: {
            startTime: formData.shiftStart,
            minWorkHours: 8,
            graceMinutes: Number(formData.graceMinutes),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to create employee");
      }

      setIsModalOpen(false);
      setFormData({
        name: "",
        employeeCode: "",
        phone: "",
        email: "",
        password: "",
        role: "sales_staff",
        department: "Sales",
        shiftStart: "09:30",
        graceMinutes: 15,
      });
      fetchEmployees();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`${API_BASE}/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchEmployees();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      
      {/* 1. TOP GLOBAL HEADER (Tailored Cleanly for Mohali HQ) */}
      <header className="bg-white border-b border-[#EAE4DC] px-6 py-3.5 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-sm font-black tracking-wider uppercase text-stone-900">KS Woods Decor</div>
            <div className="text-[10px] uppercase tracking-widest text-[#B5562A] font-bold">Management Portal</div>
          </div>

          {/* Clean Branch Badge (Focused on Mohali Showroom & Factory) */}
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EAE4DC] px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700">
            <Building2 className="w-3.5 h-3.5 text-[#B5562A]" />
            <span>Mohali HQ & Factory</span>
            <span className="text-[10px] text-stone-400 font-mono">(Plot 787, JLPL)</span>
          </div>
        </div>

        {/* Right side status & role */}
        <div className="flex items-center gap-4">
          {/* Live MongoDB Atlas / API indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-md">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === "online" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-stone-500 text-[11px]">
              {backendStatus === "online" ? "Atlas DB Live" : "Connecting..."}
            </span>
          </div>

          {/* Role simulation */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-xs">
            <span className="text-amber-800 font-medium">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              aria-label="Select role"
              className="bg-transparent font-bold text-amber-900 outline-none cursor-pointer capitalize"
            >
              <option value="super_admin">Super Admin</option>
              <option value="hr">HR Manager</option>
              <option value="branch_manager">Branch Manager</option>
              <option value="sales_staff">Sales Staff</option>
            </select>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#B5562A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            WD
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION TABS */}
      <div className="bg-white border-b border-[#EAE4DC] px-6 flex gap-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("users")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "users" ? "border-[#B5562A] text-[#B5562A]" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Users className="w-4 h-4" /> Staff Directory ({staffList.length})
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "attendance" ? "border-[#B5562A] text-[#B5562A]" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Clock className="w-4 h-4" /> Check-In / Check-Out
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === "permissions" ? "border-[#B5562A] text-[#B5562A]" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Permission Demo Pages
        </button>
      </div>

      {/* 3. MAIN CONTENT BODY */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        
        {/* VIEW 1: STAFF DIRECTORY */}
        {activeTab === "users" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-900">Staff & Identity Directory</h1>
                <p className="text-sm text-stone-500 mt-0.5">Employees assigned to Mohali Showroom & Factory.</p>
              </div>
              {(selectedRole === "super_admin" || selectedRole === "hr") && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#B5562A] hover:bg-[#8F3F1C] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Employee</span>
                </button>
              )}
            </div>

            {/* Search & Filter Strip */}
            <div className="bg-white border border-[#EAE4DC] p-3 rounded-xl flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by name, employee ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter status"
                className="text-xs font-semibold px-3 py-1.5 border border-stone-200 rounded-lg outline-none bg-stone-50 text-stone-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Deactivated</option>
              </select>
            </div>

            {/* Clean Staff Table */}
            <div className="bg-white border border-[#EAE4DC] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-xs font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">Role & Dept</th>
                      <th className="py-3 px-4">Shift Timings</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-stone-400">
                          Connecting to MongoDB Atlas...
                        </td>
                      </tr>
                    ) : filteredStaff.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-stone-400">
                          No employees found. Click "+ Add Employee" to add the first one.
                        </td>
                      </tr>
                    ) : (
                      filteredStaff.map((s) => (
                        <tr key={s._id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{s.name}</div>
                            <div className="text-xs text-stone-400 font-mono">{s.employeeCode}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-xs text-stone-700">{s.phone}</div>
                            <div className="text-[11px] text-stone-400">{s.email || "No email"}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-xs font-bold capitalize text-stone-800">{s.role.replace("_", " ")}</div>
                            <div className="text-[11px] text-stone-400">{s.department}</div>
                          </td>
                          <td className="py-3 px-4 text-xs text-stone-600">
                            {s.shift?.startTime || "09:30"} (Grace: {s.shift?.graceMinutes || 15}m)
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                s.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              {s.status === "active" ? "Active" : "Deactivated"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {(selectedRole === "super_admin" || selectedRole === "hr") && (
                              <button
                                onClick={() => handleToggleStatus(s._id, s.status)}
                                className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition"
                              >
                                {s.status === "active" ? "Deactivate" : "Reactivate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 2: UNCLUTTERED ATTENDANCE CARD */}
        {activeTab === "attendance" && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">Attendance Terminal</h1>
              <p className="text-sm text-stone-500 mt-1">Mohali Showroom & Factory Geofence Verification</p>
            </div>

            <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-stone-400">Current Time</div>
                  <div className="text-2xl font-black text-stone-900">{currentTime || "09:30:00 AM"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider font-bold text-stone-400">Assigned Shift</div>
                  <div className="text-sm font-bold text-[#B5562A]">09:30 AM – 06:00 PM</div>
                  <div className="text-[11px] text-stone-400">Grace period till 09:45 AM</div>
                </div>
              </div>

              {/* Geofence Radar Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="font-bold text-emerald-900">📍 Mohali Showroom & Factory</div>
                    <div className="text-emerald-700">Plot No. 787, JLPL Industrial Area · Within 14m</div>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified On-Site
                </span>
              </div>

              {/* Camera Preview */}
              <div className="relative bg-stone-900 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center border-2 border-stone-200">
                <div className="text-center text-stone-400 space-y-2 p-6">
                  <Camera className="w-10 h-10 mx-auto text-stone-500" />
                  <div className="text-xs font-medium">WebRTC Live Selfie Viewfinder</div>
                  <div className="text-[11px] text-stone-500">Auto-watermarked with timestamp & GPS coordinates</div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded">
                  LAT: 30.6782 · LNG: 76.7058 · GPS ACCURACY: 12m
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsPunchedIn(!isPunchedIn)}
                className={`w-full py-3.5 rounded-xl font-bold text-base shadow-xs transition flex items-center justify-center gap-2 ${
                  isPunchedIn
                    ? "bg-stone-900 hover:bg-stone-800 text-white"
                    : "bg-[#B5562A] hover:bg-[#8F3F1C] text-white"
                }`}
              >
                <span>{isPunchedIn ? "👋 Confirm & Check-Out" : "📸 Confirm & Check-In"}</span>
              </button>

              <div className="text-center text-xs text-stone-500 font-medium">
                {isPunchedIn ? (
                  <span className="text-emerald-700 font-bold">✓ Clocked in at 09:32 AM (Selfie & GPS Verified)</span>
                ) : (
                  "Ready to punch. Please center your face in the viewfinder."
                )}
              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: PERMISSION DEMO PLACEHOLDERS */}
        {activeTab === "permissions" && (
          <section className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">Role & Permission Simulation</h1>
              <p className="text-sm text-stone-500 mt-0.5">Test how different roles access future modules (Invoices, Inventory, Settings).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-[#EAE4DC] rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-stone-900">📄 Proforma Invoices</div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Allowed
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Sales quotation creation, 50% advance milestone tracking, and vector PDF lookbooks.
                </p>
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  Visible to: Super Admin, Branch Manager, Sales Staff
                </div>
              </div>

              <div className="bg-white border border-[#EAE4DC] rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-stone-900">🪵 Inventory & Stock</div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      selectedRole === "sales_staff" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedRole === "sales_staff" ? "Access Denied" : "Allowed"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Mohali showroom floor display counts and warehouse raw wood/fabric balances.
                </p>
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  Visible to: Super Admin, Branch Manager, Accounts
                </div>
              </div>

              <div className="bg-white border border-[#EAE4DC] rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-stone-900">⚙️ Master Branch Config</div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      selectedRole === "super_admin" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {selectedRole === "super_admin" ? "Allowed" : "Access Denied"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Geofence coordinates adjustment, GSTIN tax rules, and bank account setups.
                </p>
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  Visible to: Super Admin only
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL: ADD EMPLOYEE (Hooks to live MongoDB Atlas) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#EAE4DC] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900">Add New Employee (Mohali HQ)</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 font-bold">
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaspreet Singh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KSWD-MOH-015"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A] uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="jaspreet@woodsdecor.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A] bg-white capitalize"
                  >
                    <option value="sales_staff">Sales Staff</option>
                    <option value="branch_manager">Branch Manager</option>
                    <option value="hr">HR Manager</option>
                    <option value="workshop_labour">Workshop Karigar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A] bg-white"
                  >
                    <option value="Sales">Sales & Showroom</option>
                    <option value="Production">Production & Workshop</option>
                    <option value="Design">Interior Architecture</option>
                    <option value="Accounts">Accounts & Finance</option>
                    <option value="HR">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Shift Start Time</label>
                  <input
                    type="time"
                    value={formData.shiftStart}
                    onChange={(e) => setFormData({ ...formData, shiftStart: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Grace Period (Minutes)</label>
                  <input
                    type="number"
                    value={formData.graceMinutes}
                    onChange={(e) => setFormData({ ...formData, graceMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-[#B5562A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#B5562A] hover:bg-[#8F3F1C] text-white rounded-lg font-semibold text-xs shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
