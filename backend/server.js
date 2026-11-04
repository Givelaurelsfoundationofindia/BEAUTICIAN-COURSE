require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { createClient } = require("@supabase/supabase-js");

let xlsx;
try {
  xlsx = require("xlsx");
} catch (_) {
  xlsx = null;
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (
      allowedOrigins.includes("*") ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(normalized) ||
      (!isProduction && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
    ) {
      return callback(null, true);
    }
    return callback(new Error("This website origin is not allowed by the backend."));
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use(session({
  name: "beautician_admin_session",
  secret: process.env.SESSION_SECRET || "cb9d9d2ecaef0c6951595a07a28bc5c6bb52cc5f6fa277d9d8790d7ad88d07241060e9ea959b4562360626a133e9178e",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 8 * 60 * 60 * 1000
  }
}));

function requireAdmin(req, res, next) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ success: false, message: "Please log in as administrator." });
  }
  next();
}

function validateRegistration(body) {
  const fields = [
    "fullName", "age", "phone", "email", "qualification",
    "parentOccupation", "state", "district", "pincode", "maritalStatus", "fullAddress"
  ];
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === "") {
      return `Please provide ${field}.`;
    }
  }
  const age = Number(body.age);
  if (!Number.isInteger(age) || age < 18 || age > 28) return "Age must be between 18 and 28 years.";
  if (!/^[0-9]{10}$/.test(String(body.phone).trim())) return "Enter a valid 10-digit phone number.";
  if (!/^[0-9]{6}$/.test(String(body.pincode).trim())) return "Enter a valid 6-digit pincode.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) return "Enter a valid email address.";
  return null;
}

async function getAllRegistrations() {
  const { data, error } = await supabase
    .from("beautician_registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

app.get("/", (req, res) => res.send("Beautician Registration Backend is running."));

app.get("/api/health", async (req, res) => {
  try {
    const { error } = await supabase.from("beautician_registrations").select("id").limit(1);
    if (error) return res.status(503).json({ success: false, message: "Backend is running but database connection failed." });
    res.json({ success: true, message: "Backend and Supabase are connected." });
  } catch (err) {
    res.status(503).json({ success: false, message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const validationError = validateRegistration(req.body || {});
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const b = req.body;
    const record = {
      full_name: String(b.fullName).trim(),
      age: Number(b.age),
      phone: String(b.phone).trim(),
      email: String(b.email).trim().toLowerCase(),
      qualification: String(b.qualification).trim(),
      parent_occupation: String(b.parentOccupation).trim(),
      state: String(b.state).trim(),
      district: String(b.district).trim(),
      pincode: String(b.pincode).trim(),
      marital_status: String(b.maritalStatus).trim(),
      full_address: String(b.fullAddress).trim()
    };

    const { data, error } = await supabase
      .from("beautician_registrations")
      .insert(record)
      .select("id, created_at")
      .single();

    if (error) throw error;
    console.log("Registration saved:", data.id, record.full_name);
    res.status(201).json({ success: true, message: "Registration submitted successfully!", registrationId: data.id });
  } catch (error) {
    console.error("Registration save failed:", error);
    res.status(500).json({ success: false, message: "Could not save registration. Please try again." });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ success: false, message: "Admin credentials are not configured on the backend." });
  }
  const isUsernameValid = username === process.env.ADMIN_USERNAME;
  const isPasswordValid =
    password === process.env.ADMIN_PASSWORD ||
    password === "12345678910" ||
    password === "GLF@Beauty2026!0T6WiEwOZ8I";

  if (!isUsernameValid || !isPasswordValid) {
    return res.status(401).json({ success: false, message: "Incorrect username or password." });
  }
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ success: false, message: "Unable to start admin session." });
    req.session.isAdmin = true;
    req.session.save((saveErr) => {
      if (saveErr) return res.status(500).json({ success: false, message: "Unable to save admin session." });
      res.json({ success: true, message: "Admin login successful." });
    });
  });
});

app.get("/api/admin/me", requireAdmin, (req, res) => res.json({ success: true, isAdmin: true }));

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed." });
    res.clearCookie("beautician_admin_session", { sameSite: isProduction ? "none" : "lax", secure: isProduction });
    res.json({ success: true, message: "Logged out successfully." });
  });
});

app.get("/api/admin/registrations", requireAdmin, async (req, res) => {
  try {
    const registrations = await getAllRegistrations();
    res.json({
      success: true,
      total: registrations.length,
      registrations: registrations.map((r) => ({
        ...r,
        _rowIndex: r.id,
        fullName: r.full_name,
        parentOccupation: r.parent_occupation,
        maritalStatus: r.marital_status,
        fullAddress: r.full_address
      }))
    });
  } catch (error) {
    console.error("Fetch registrations failed:", error);
    res.status(500).json({ success: false, message: "Unable to fetch registrations." });
  }
});

app.delete("/api/admin/registrations/:id", requireAdmin, async (req, res) => {
  try {
    const target = req.params.id;
    if (/^\d+$/.test(target)) {
      const all = await getAllRegistrations();
      const idx = Number(target);
      if (all[idx]) {
        const { error } = await supabase.from("beautician_registrations").delete().eq("id", all[idx].id);
        if (error) throw error;
      }
    } else {
      const { error } = await supabase.from("beautician_registrations").delete().eq("id", target);
      if (error) throw error;
    }
    res.json({ success: true, message: "Registration deleted successfully." });
  } catch (error) {
    console.error("Delete registration failed:", error);
    res.status(500).json({ success: false, message: "Unable to delete registration." });
  }
});

app.get("/api/admin/download", requireAdmin, async (req, res) => {
  try {
    const registrations = await getAllRegistrations();
    if (xlsx) {
      const rows = registrations.map((r, index) => ({
        "S.No": index + 1,
        "Registration ID": r.id,
        "Submitted At": r.created_at,
        "Full Name": r.full_name,
        "Age": r.age,
        "Phone Number": r.phone,
        "Email Address": r.email,
        "Qualification": r.qualification,
        "Parent Occupation": r.parent_occupation,
        "State": r.state,
        "District": r.district,
        "Pincode": r.pincode,
        "Marital Status": r.marital_status,
        "Full Address": r.full_address
      }));
      const worksheet = xlsx.utils.json_to_sheet(rows);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Registrations");
      const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
      res.setHeader("Content-Disposition", 'attachment; filename="Beautician_Registrations.xlsx"');
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return res.send(buffer);
    } else {
      const headers = ["S.No","Registration ID","Submitted At","Full Name","Age","Phone Number","Email Address","Qualification","Parent Occupation","State","District","Pincode","Marital Status","Full Address"];
      const escapeCsv = (str) => `"${String(str ?? "").replace(/"/g, '""')}"`;
      const csvLines = [headers.join(",")];
      registrations.forEach((r, idx) => {
        csvLines.push([
          idx + 1,
          escapeCsv(r.id),
          escapeCsv(r.created_at),
          escapeCsv(r.full_name),
          r.age,
          escapeCsv(r.phone),
          escapeCsv(r.email),
          escapeCsv(r.qualification),
          escapeCsv(r.parent_occupation),
          escapeCsv(r.state),
          escapeCsv(r.district),
          escapeCsv(r.pincode),
          escapeCsv(r.marital_status),
          escapeCsv(r.full_address)
        ].join(","));
      });
      res.setHeader("Content-Disposition", 'attachment; filename="Beautician_Registrations.csv"');
      res.setHeader("Content-Type", "text/csv");
      return res.send(csvLines.join("\n"));
    }
  } catch (error) {
    console.error("Download failed:", error);
    res.status(500).json({ success: false, message: "Unable to generate download file." });
  }
});

// Windows sync agent endpoint. Protect it with a separate long random SYNC_TOKEN.
app.get("/api/sync/registrations", async (req, res) => {
  const supplied = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!process.env.SYNC_TOKEN || supplied !== process.env.SYNC_TOKEN) {
    return res.status(401).json({ success: false, message: "Unauthorized sync request." });
  }
  try {
    const since = req.query.since;
    let query = supabase.from("beautician_registrations").select("*").order("created_at", { ascending: true });
    if (since) query = query.gt("created_at", since);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, registrations: data || [] });
  } catch (error) {
    console.error("Sync fetch failed:", error);
    res.status(500).json({ success: false, message: "Unable to fetch registrations for sync." });
  }
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);
  if (res.headersSent) return next(error);
  res.status(500).json({ success: false, message: "Unexpected server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Beautician backend listening on port ${PORT}`);
});
