require("dotenv").config();

const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

app.use(
  session({
    name: "beautician_admin_session",
    secret: process.env.SESSION_SECRET || "local-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 30 * 60 * 1000
    }
  })
);

// ==========================================
// EXCEL FILE CONFIGURATION
// ==========================================

const excelFile = path.join(__dirname, "registrations.xlsx");

function readRegistrations() {
  if (!fs.existsSync(excelFile)) {
    return [];
  }

  const workbook = XLSX.readFile(excelFile);
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return [];
  }

  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

function saveRegistrations(registrations) {
  const worksheet = XLSX.utils.json_to_sheet(registrations);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Registrations"
  );

  XLSX.writeFile(workbook, excelFile);
}

// ==========================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ==========================================

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login as admin."
    });
  }

  next();
}

// ==========================================
// 1. STUDENT REGISTRATION API
// ==========================================

app.post("/api/register", (req, res) => {
  try {
    const {
      fullName,
      age,
      phone,
      email,
      qualification,
      parentOccupation,
      state,
      district,
      pincode,
      maritalStatus,
      fullAddress
    } = req.body;

    const requiredFields = {
      fullName,
      age,
      phone,
      email,
      qualification,
      parentOccupation,
      state,
      district,
      pincode,
      maritalStatus,
      fullAddress
    };

    // REQUIRED FIELD VALIDATION

    for (const [field, value] of Object.entries(requiredFields)) {
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `Please provide ${field}.`
        });
      }
    }

    // AGE VALIDATION

    const numericAge = Number(age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge < 18 ||
      numericAge > 28
    ) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 18 and 28 years."
      });
    }

    // PHONE VALIDATION

    if (!/^[0-9]{10}$/.test(String(phone))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit phone number."
      });
    }

    // PINCODE VALIDATION

    if (!/^[0-9]{6}$/.test(String(pincode))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 6-digit pincode."
      });
    }

    // EMAIL VALIDATION

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address."
      });
    }

    // CREATE REGISTRATION RECORD

    const registration = {
      "Registration Date": new Date().toLocaleString("en-IN"),
      "Full Name": String(fullName).trim(),
      "Age": numericAge,
      "Phone Number": String(phone),
      "Email Address": String(email).trim(),
      "Educational Qualification": String(qualification).trim(),
      "Parent Occupation": String(parentOccupation).trim(),
      "State": String(state).trim(),
      "District": String(district).trim(),
      "Pincode": String(pincode),
      "Marital Status": String(maritalStatus).trim(),
      "Full Address": String(fullAddress).trim()
    };

    // READ EXISTING EXCEL DATA

    const existingRows = readRegistrations();

    // ADD NEW REGISTRATION

    existingRows.push(registration);

    // SAVE TO EXCEL

    saveRegistrations(existingRows);

    console.log(
      "New registration saved:",
      registration["Full Name"]
    );

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully!"
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save registration. Please try again."
    });
  }
});

// ==========================================
// 2. ADMIN LOGIN API
// ==========================================

app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials are not configured."
      });
    }

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Incorrect username or password."
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Unable to create admin session."
        });
      }

      req.session.isAdmin = true;

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            success: false,
            message: "Unable to save admin session."
          });
        }

        return res.json({
          success: true,
          message: "Admin login successful."
        });
      });
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Admin login failed."
    });
  }
});

// ==========================================
// 3. CHECK ADMIN SESSION API
// ==========================================

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({
    success: true,
    isAdmin: true
  });
});

// ==========================================
// 4. ADMIN LOGOUT API
// ==========================================

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed."
      });
    }

    res.clearCookie("beautician_admin_session");

    res.json({
      success: true,
      message: "Logged out successfully."
    });
  });
});

// ==========================================
// 5. GET ALL REGISTRATIONS API
// ADMIN ONLY
// ==========================================

app.get("/api/admin/registrations", requireAdmin, (req, res) => {
  try {
    const registrations = readRegistrations();

    res.json({
      success: true,
      total: registrations.length,
      registrations
    });

  } catch (error) {
    console.error("Fetch registrations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch registrations."
    });
  }
});

// ==========================================
// 6. DELETE REGISTRATION API
// ADMIN ONLY
// ==========================================

app.delete(
  "/api/admin/registrations/:index",
  requireAdmin,
  (req, res) => {
    try {
      const index = Number(req.params.index);

      const registrations = readRegistrations();

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= registrations.length
      ) {
        return res.status(404).json({
          success: false,
          message: "Registration not found."
        });
      }

      const deletedRegistration = registrations[index];

      registrations.splice(index, 1);

      saveRegistrations(registrations);

      console.log(
        "Registration deleted:",
        deletedRegistration["Full Name"]
      );

      return res.json({
        success: true,
        message: "Registration deleted successfully."
      });

    } catch (error) {
      console.error("Delete registration error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to delete registration."
      });
    }
  }
);

// ==========================================
// 7. DOWNLOAD EXCEL API
// ADMIN ONLY
// ==========================================

app.get("/api/admin/download", requireAdmin, (req, res) => {
  try {
    if (!fs.existsSync(excelFile)) {
      return res.status(404).json({
        success: false,
        message: "No registrations available."
      });
    }

    res.download(
      excelFile,
      "Beautician-Registrations.xlsx"
    );

  } catch (error) {
    console.error("Excel download error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to download Excel file."
    });
  }
});

// ==========================================
// 8. HOME API
// ==========================================

app.get("/", (req, res) => {
  res.send(
    "Beautician Registration Backend is running successfully!"
  );
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("------------------------------------");
  console.log("BEAUTICIAN BACKEND STARTED");
  console.log("------------------------------------");
  console.log(`Server: http://localhost:${PORT}`);
  console.log("Registration API: /api/register");
  console.log("Admin Login API: /api/admin/login");
  console.log("Admin Dashboard API: /api/admin/registrations");
  console.log("Delete API: DELETE /api/admin/registrations/:index");
  console.log("------------------------------------");
});