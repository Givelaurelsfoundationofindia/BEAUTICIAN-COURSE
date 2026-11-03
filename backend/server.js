require("dotenv").config();

const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

function isAllowedFrontendOrigin(origin) {
  // Requests from curl/Postman and same-origin server calls have no Origin header.
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, "");
  if (allowedOrigins.includes("*") || allowedOrigins.includes(normalizedOrigin)) return true;

  // During local development, Vite may select 5173, 5174, 5175, etc.
  // Also allow a private LAN address when testing from another device on the same network.
  if (process.env.NODE_ENV !== "production") {
    try {
      const parsed = new URL(normalizedOrigin);
      if (parsed.protocol !== "http:") return false;
      const host = parsed.hostname.toLowerCase();
      if (host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1") {
        return true;
      }
      const parts = host.split(".").map(Number);
      if (parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)) {
        return parts[0] === 10 ||
          (parts[0] === 192 && parts[1] === 168) ||
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

app.use(cors({
  origin(origin, callback) {
    // Return false for an unapproved origin instead of throwing an unhandled server error.
    callback(null, isAllowedFrontendOrigin(origin));
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

if (!process.env.SESSION_SECRET || !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.warn("Warning: Set SESSION_SECRET, ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env");
}

app.use(session({
  name: "beautician_admin_session",
  secret: process.env.SESSION_SECRET || "CHANGE_THIS_LOCAL_SECRET_BEFORE_DEPLOYMENT",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60 * 1000
  }
}));

// One .xlsx Excel file containing one worksheet named "Registrations".
const excelFile = path.join(__dirname, "Beautician_Registrations.xlsx");
const tempExcelFile = path.join(__dirname, "Beautician_Registrations.tmp.xlsx");

const COLUMNS = [
  "Registration Date",
  "Full Name",
  "Age",
  "Phone Number",
  "Email Address",
  "Educational Qualification",
  "Parent Occupation",
  "State",
  "District",
  "Pincode",
  "Marital Status",
  "Full Address"
];

function readRegistrations() {
  if (!fs.existsSync(excelFile)) return [];

  const workbook = XLSX.readFile(excelFile, { cellDates: true });
  const sheet = workbook.Sheets.Registrations || workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];

  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function saveRegistrations(registrations) {
  const worksheet = XLSX.utils.json_to_sheet(registrations, { header: COLUMNS });
  worksheet["!cols"] = [
    { wch: 22 }, { wch: 26 }, { wch: 8 }, { wch: 16 },
    { wch: 30 }, { wch: 25 }, { wch: 22 }, { wch: 20 },
    { wch: 20 }, { wch: 12 }, { wch: 18 }, { wch: 45 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

  // Write a complete temporary file first, then replace the previous file.
  // This avoids leaving a half-written workbook if the process is interrupted.
  XLSX.writeFile(workbook, tempExcelFile, {
    bookType: "xlsx",
    compression: true
  });
  fs.renameSync(tempExcelFile, excelFile);
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: "Please log in as administrator."
    });
  }
  return next();
}

function validateRegistration(body) {
  const fields = [
    "fullName", "age", "phone", "email", "qualification",
    "parentOccupation", "state", "district", "pincode",
    "maritalStatus", "fullAddress"
  ];

  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === "") {
      return `Please provide ${field}.`;
    }
  }

  const age = Number(body.age);
  if (!Number.isInteger(age) || age < 18 || age > 28) {
    return "Age must be between 18 and 28 years.";
  }
  if (!/^[0-9]{10}$/.test(String(body.phone).trim())) {
    return "Enter a valid 10-digit phone number.";
  }
  if (!/^[0-9]{6}$/.test(String(body.pincode).trim())) {
    return "Enter a valid 6-digit pincode.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) {
    return "Enter a valid email address.";
  }
  if (String(body.qualification).trim() === "Other") {
    return "Please contact the foundation to confirm qualification eligibility.";
  }
  return null;
}

app.get("/", (req, res) => {
  res.send("Beautician Registration Backend is running.");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is connected." });
});

// Ensure the Excel file exists immediately with the correct worksheet and headings.
app.get("/api/register", (req, res) => {
  res.status(405).json({ success: false, message: "Use POST to submit a registration." });
});

app.post("/api/register", (req, res) => {
  try {
    const validationError = validateRegistration(req.body || {});
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const body = req.body;
    const registration = {
      "Registration Date": new Date().toLocaleString("en-IN"),
      "Full Name": String(body.fullName).trim(),
      "Age": Number(body.age),
      "Phone Number": String(body.phone).trim(),
      "Email Address": String(body.email).trim(),
      "Educational Qualification": String(body.qualification).trim(),
      "Parent Occupation": String(body.parentOccupation).trim(),
      "State": String(body.state).trim(),
      "District": String(body.district).trim(),
      "Pincode": String(body.pincode).trim(),
      "Marital Status": String(body.maritalStatus).trim(),
      "Full Address": String(body.fullAddress).trim()
    };

    const registrations = readRegistrations();
    registrations.push(registration);
    saveRegistrations(registrations);

    console.log("Registration saved:", registration["Full Name"]);
    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully!"
    });
  } catch (error) {
    console.error("Registration save failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not save the registration. Close the Excel file if it is open, then try again."
    });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      message: "Admin login is not configured. Add ADMIN_USERNAME and ADMIN_PASSWORD to backend/.env."
    });
  }

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Incorrect username or password." });
  }

  req.session.regenerate((error) => {
    if (error) {
      console.error("Session creation failed:", error);
      return res.status(500).json({ success: false, message: "Unable to start admin session." });
    }
    req.session.isAdmin = true;
    req.session.save((saveError) => {
      if (saveError) {
        console.error("Session save failed:", saveError);
        return res.status(500).json({ success: false, message: "Unable to save admin session." });
      }
      return res.json({ success: true, message: "Admin login successful." });
    });
  });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({ success: true, isAdmin: true });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout failed:", error);
      return res.status(500).json({ success: false, message: "Logout failed." });
    }
    res.clearCookie("beautician_admin_session");
    return res.json({ success: true, message: "Logged out successfully." });
  });
});

app.get("/api/admin/registrations", requireAdmin, (req, res) => {
  try {
    const registrations = readRegistrations().map((row, index) => ({
      ...row,
      _rowIndex: index
    }));
    return res.json({ success: true, total: registrations.length, registrations });
  } catch (error) {
    console.error("Reading registrations failed:", error);
    return res.status(500).json({ success: false, message: "Unable to read the Excel registration sheet." });
  }
});

app.delete("/api/admin/registrations/:index", requireAdmin, (req, res) => {
  try {
    const index = Number(req.params.index);
    const registrations = readRegistrations();

    if (!Number.isInteger(index) || index < 0 || index >= registrations.length) {
      return res.status(404).json({ success: false, message: "Registration not found." });
    }

    const [deleted] = registrations.splice(index, 1);
    saveRegistrations(registrations);
    console.log("Registration deleted:", deleted["Full Name"]);
    return res.json({ success: true, message: "Registration deleted successfully." });
  } catch (error) {
    console.error("Deleting registration failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete the registration. Close the Excel file if it is open, then try again."
    });
  }
});

app.get("/api/admin/download", requireAdmin, (req, res) => {
  try {
    if (!fs.existsSync(excelFile)) {
      saveRegistrations([]);
    }
    return res.download(excelFile, "Beautician_Registrations.xlsx");
  } catch (error) {
    console.error("Excel download failed:", error);
    return res.status(500).json({ success: false, message: "Unable to download the Excel file." });
  }
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ success: false, message: "Unexpected server error." });
});

app.listen(PORT, () => {
  try {
    if (!fs.existsSync(excelFile)) saveRegistrations([]);
    console.log("------------------------------------");
    console.log("BEAUTICIAN BACKEND STARTED");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Excel file: ${excelFile}`);
    console.log("Registration API: POST /api/register");
    console.log("Admin login: POST /api/admin/login");
    console.log("Admin dashboard API: GET /api/admin/registrations");
    console.log("------------------------------------");
  } catch (error) {
    console.error("Could not create the Excel file:", error);
  }
});
