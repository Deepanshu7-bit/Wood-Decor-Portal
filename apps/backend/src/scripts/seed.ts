import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { BranchModel } from "../models/Branch.model.js";
import { UserModel } from "../models/User.model.js";

async function seed() {
  console.log("🌱 Starting Woods Decor Database Seed...");
  await connectDB();

  // 1. Seed Mohali Branch (The Primary HQ)
  let mohali = await BranchModel.findOne({ code: "MOH" });
  if (!mohali) {
    mohali = await BranchModel.create({
      name: "KS Woods Decor (Mohali Showroom & Factory)",
      code: "MOH",
      type: "factory_showroom",
      currency: {
        code: "INR",
        symbol: "₹",
        locale: "en-IN",
      },
      timezone: "Asia/Kolkata",
      location: {
        type: "Point",
        coordinates: [76.7058, 30.6782], // [Longitude, Latitude] for Plot 787, JLPL Mohali
      },
      geofenceRadiusMeters: 250,
      address: {
        line1: "Plot No. 787, JLPL Industrial Area",
        city: "Sector 82, SAS Nagar (Mohali)",
        state: "Punjab",
        postalCode: "160055",
        country: "India",
      },
      taxIdentifiers: {
        gstin: "03AAICK3557H1ZK",
        iec: "AAICK3557H",
      },
      isActive: true,
    });
    console.log("✓ Mohali Branch created successfully!");
  } else {
    console.log("ℹ Mohali Branch already exists.");
  }

  // 2. Seed Default Super Admin
  const adminCode = "KSWD-MOH-001";
  const existingAdmin = await UserModel.findOne({ employeeCode: adminCode });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);

    await UserModel.create({
      employeeCode: adminCode,
      name: "System Super Admin",
      phone: "+91 9876543210",
      email: "admin@woodsdecor.in",
      passwordHash,
      role: "super_admin",
      branchId: mohali._id,
      department: "Admin",
      shift: {
        startTime: "09:30",
        minWorkHours: 8,
        graceMinutes: 15,
      },
      status: "active",
    });
    console.log(`✓ Default Super Admin created! Code: ${adminCode} (Password: admin123)`);
  } else {
    console.log("ℹ Super Admin already exists.");
  }

  console.log("\n🎉 Seed complete! Closing database connection.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
