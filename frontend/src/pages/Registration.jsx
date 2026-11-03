
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";
import SuccessPopup from "../components/SuccessPopup";

function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const age = Number(data.age);

    // AGE VALIDATION
    if (!Number.isInteger(age) || age < 18 || age > 28) {
      alert("Age must be between 18 and 28 years.");
      return;
    }

    // PHONE VALIDATION
    if (!/^[0-9]{10}$/.test(data.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // PINCODE VALIDATION
    if (!/^[0-9]{6}$/.test(data.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setIsSubmitting(true);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Registration submission failed."
        );
      }

      // RESET FORM AFTER SUCCESSFUL SUBMISSION
      form.reset();

      // SHOW SUCCESS POPUP
      setSuccessPopup(true);

    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        error.message ||
        "Unable to submit registration. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">

      {/* HEADER */}
      <header className="register-header">


        {/* FOUNDATION LOGO - LEFT */}
        <Link to="/" className="register-logo">
          <img
            src="/give-laurels-logo.png"
            alt="Give Laurels Foundation of India"
          />
        </Link>
        

        {/* BACK TO HOME - TOP RIGHT */}
        <Link to="/" className="back-home-button">
  ← Back to Home
</Link>

      </header>

      {/* REGISTRATION FORM SECTION */}
      <section className="register-form-section">

        {/* PAGE HEADING */}
        <div className="register-form-heading">

          <span>YOUR APPLICATION</span>

          <h2>
            <span>Registration</span> Details
          </h2>

          <p>
            Please enter your details carefully.
          </p>

        </div>

        {/* REGISTRATION FORM */}
        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section-title">
            Personal Information
          </div>

          {/* FULL NAME */}
          <div className="register-field">

            <label>Full Name *</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

          </div>

          {/* AGE */}
          <div className="register-field">

            <label>Age *</label>

            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              min="18"
              max="28"
              required
            />

            <small>
              Eligible age: 18–28 years
            </small>

          </div>

          {/* PHONE NUMBER */}
          <div className="register-field">

            <label>Phone Number *</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength="10"
              inputMode="numeric"
              autoComplete="tel"
              required
            />

          </div>

          {/* EMAIL */}
          <div className="register-field">

            <label>Email Address *</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />

          </div>

          {/* EDUCATIONAL QUALIFICATION */}
          <div className="register-field">

            <label>Educational Qualification *</label>

            <select
              name="qualification"
              defaultValue=""
              required
            >

              <option value="" disabled>
                Select your qualification
              </option>

              <option value="10th Pass">
                10th Pass
              </option>

              <option value="Intermediate">
                Intermediate / 12th
              </option>

              <option value="Diploma">
                Diploma
              </option>

              <option value="Graduate">
                Graduate
              </option>

              <option value="Postgraduate">
                Postgraduate
              </option>

              <option value="Other">
                Other
              </option>

            </select>

            <small>
              Minimum qualification: 10th Pass
            </small>

          </div>

          {/* PARENT OCCUPATION */}
          <div className="register-field">

            <label>Parent Occupation *</label>

            <input
              type="text"
              name="parentOccupation"
              placeholder="Enter parent occupation"
              required
            />

          </div>

          {/* STATE */}
          <div className="register-field">

            <label>State *</label>

            <select
              name="state"
              defaultValue=""
              required
            >

              <option value="" disabled>
                Select your state
              </option>

              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Other">Other</option>

            </select>

          </div>

          {/* DISTRICT */}
          <div className="register-field">

            <label>District *</label>

            <input
              type="text"
              name="district"
              placeholder="Enter your district"
              required
            />

          </div>

          {/* PINCODE */}
          <div className="register-field">

            <label>Pincode *</label>

            <input
              type="text"
              name="pincode"
              placeholder="Enter 6-digit pincode"
              pattern="[0-9]{6}"
              maxLength="6"
              inputMode="numeric"
              required
            />

          </div>

          {/* MARITAL STATUS */}
          <div className="register-field">

            <label>Marital Status *</label>

            <select
              name="maritalStatus"
              defaultValue=""
              required
            >

              <option value="" disabled>
                Select marital status
              </option>

              <option value="Single">
                Single
              </option>

              <option value="Married">
                Married
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* FULL ADDRESS */}
          <div className="register-field full-width">

            <label>Full Address *</label>

            <textarea
              name="fullAddress"
              placeholder="Enter your complete residential address"
              rows="4"
              autoComplete="street-address"
              required
            />

          </div>

          {/* ELIGIBILITY NOTE */}
          <div className="register-confirmation">

            <strong>
              Before submitting your application
            </strong>

            <p>
              Please make sure you are between 18 and 28 years
              of age and have completed at least 10th standard.
            </p>

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="register-submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Submitting..."
              : "Submit Registration"}

            {!isSubmitting && <span> → </span>}

          </button>

          {/* BOTTOM NOTE */}
          <p className="register-bottom-note">
            Free Basic Beautician Training Programme
            <br />
            Limited to 25 Seats
          </p>

        </form>

      </section>

      {/* FOOTER */}
      <footer className="register-footer">

        <p>
          © {new Date().getFullYear()} Give Laurels Foundation of India.
          All Rights Reserved.
        </p>

        <Link to="/">
          Return to Main Website
        </Link>

      </footer>

      {/* REGISTRATION SUCCESS POPUP */}
      <SuccessPopup
        show={successPopup}
        title="Submitted Successfully!"
        message="Your beautician training registration has been received successfully. Thank you for applying!"
        onClose={() => setSuccessPopup(false)}
      />

    </div>
  );
}

export default Register;
