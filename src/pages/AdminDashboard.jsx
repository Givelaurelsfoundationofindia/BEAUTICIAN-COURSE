
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import SuccessPopup from "../components/SuccessPopup";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [successPopup, setSuccessPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/registrations`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch registrations.");
      }

      const rows = Array.isArray(data.registrations)
        ? data.registrations
        : [];

      // Preserve original Excel row index for correct deletion
      const formattedRows = rows.map((student, index) => ({
        ...student,
        _rowIndex:
          student._rowIndex !== undefined
            ? student._rowIndex
            : index,
      }));

      setRegistrations(formattedRows);
    } catch (err) {
      console.error("Fetch registrations error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Get field values safely
  const getValue = (student, keys) => {
    for (const key of keys) {
      const value = student?.[key];

      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }

    return "-";
  };

  const getName = (student) =>
    getValue(student, ["fullName", "full_name", "name", "Full Name"]);

  const getPhone = (student) =>
    getValue(student, ["phone", "phoneNumber", "phone_number", "Phone Number"]);

  const getEmail = (student) =>
    getValue(student, ["email", "emailAddress", "email_address", "Email Address"]);

  const getState = (student) =>
    getValue(student, ["state", "State"]);

  // Available states for filter
  const states = useMemo(() => {
    const stateNames = registrations
      .map((student) => getState(student))
      .filter((state) => state !== "-");

    return ["All", ...new Set(stateNames)];
  }, [registrations]);

  // Search and filter
  const filteredRegistrations = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return registrations.filter((student) => {
      const searchableText = [
        getName(student),
        getPhone(student),
        getEmail(student),
        getState(student),
        getValue(student, ["age", "Age"]),
        getValue(student, ["qualification", "education", "educationalQualification"]),
        getValue(student, ["district", "District"]),
        getValue(student, ["pincode", "pinCode", "Pincode"]),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchText);

      const matchesState =
        stateFilter === "All" || getState(student) === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [registrations, search, stateFilter]);

  // Delete registration
  const handleDelete = async (student) => {
    const studentName = getName(student);

    const confirmed = window.confirm(
      `Are you sure you want to delete the registration of ${studentName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/registrations/${student._rowIndex}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete registration.");
      }

      setSelectedStudent(null);

      await fetchRegistrations();

      setSuccessPopup({
        show: true,
        title: "Registration Deleted!",
        message: "The student's registration has been successfully deleted.",
      });
    } catch (err) {
      console.error("Delete registration error:", err);
      setError(err.message || "Unable to delete registration.");
    } finally {
      setDeleting(false);
    }
  };

  // Download Excel
  const handleDownload = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/download`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to download Excel file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Beautician_Registrations.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError(err.message || "Excel download failed.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/admin/login");
    }
  };

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Beautician Training Registration Management</p>
        </div>

        <div className="admin-header-actions">
          <button
            className="admin-download-btn"
            onClick={handleDownload}
          >
            Download Excel
          </button>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="admin-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Statistics */}
      <section className="admin-stats">
        <div className="admin-stat-card">
          <h3>Total Registrations</h3>
          <h2>{registrations.length}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Filtered Results</h3>
          <h2>{filteredRegistrations.length}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>States Covered</h3>
          <h2>{Math.max(states.length - 1, 0)}</h2>
        </div>
      </section>

      {/* Registration list */}
      <section className="admin-registration-section">
        <div className="admin-section-heading">
          <div>
            <h2>Student Registrations</h2>
            <p>View and manage submitted registration details.</p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchRegistrations}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Search and filter */}
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search by name, phone, email or pincode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state === "All" ? "All States" : state}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="admin-loading">
            Loading registrations...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="admin-empty">
            No registrations found.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRegistrations.map((student, index) => (
                  <tr key={student._rowIndex}>
                    <td>{index + 1}</td>

                    <td>{getName(student)}</td>

                    <td>{getPhone(student)}</td>

                    <td>{getEmail(student)}</td>

                    <td>
                      {getValue(student, ["age", "Age"])}
                    </td>

                    <td>{getState(student)}</td>

                    <td>
                      {getValue(student, ["district", "District"])}
                    </td>

                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-view-btn"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View
                        </button>

                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(student)}
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* View Details Modal */}
      {selectedStudent && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h2>Registration Details</h2>
                <p>Student information</p>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-details-grid">
              <div>
                <strong>Full Name</strong>
                <p>{getName(selectedStudent)}</p>
              </div>

              <div>
                <strong>Age</strong>
                <p>{getValue(selectedStudent, ["age", "Age"])}</p>
              </div>

              <div>
                <strong>Phone Number</strong>
                <p>{getPhone(selectedStudent)}</p>
              </div>

              <div>
                <strong>Email Address</strong>
                <p>{getEmail(selectedStudent)}</p>
              </div>

              <div>
                <strong>Educational Qualification</strong>
                <p>
                  {getValue(selectedStudent, [
                    "qualification",
                    "education",
                    "educationalQualification",
                    "educational_qualification",
                  ])}
                </p>
              </div>

              <div>
                <strong>Parent Occupation</strong>
                <p>
                  {getValue(selectedStudent, [
                    "parentOccupation",
                    "parent_occupation",
                  ])}
                </p>
              </div>

              <div>
                <strong>State</strong>
                <p>{getState(selectedStudent)}</p>
              </div>

              <div>
                <strong>District</strong>
                <p>
                  {getValue(selectedStudent, ["district", "District"])}
                </p>
              </div>

              <div>
                <strong>Pincode</strong>
                <p>
                  {getValue(selectedStudent, ["pincode", "pinCode", "Pincode"])}
                </p>
              </div>

              <div>
                <strong>Marital Status</strong>
                <p>
                  {getValue(selectedStudent, [
                    "maritalStatus",
                    "marital_status",
                  ])}
                </p>
              </div>

              <div className="admin-detail-full-width">
                <strong>Full Address</strong>
                <p>
                  {getValue(selectedStudent, [
                    "address",
                    "fullAddress",
                    "full_address",
                  ])}
                </p>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-modal-close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>

              <button
                className="admin-delete-btn"
                disabled={deleting}
                onClick={() => handleDelete(selectedStudent)}
              >
                {deleting ? "Deleting..." : "Delete Registration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup
        show={successPopup.show}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() =>
          setSuccessPopup({
            show: false,
            title: "",
            message: "",
          })
        }
      />

    </div>
  );
}

export default AdminDashboard;
