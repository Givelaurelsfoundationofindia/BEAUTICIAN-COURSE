import React from "react";
import "./SuccessPopup.css";

function SuccessPopup({
  show,
  title = "Submitted Successfully!",
  message = "Your details have been submitted successfully.",
  onClose
}) {
  if (!show) return null;

  return (
    <div className="success-popup-overlay">
      <div
        className="success-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-popup-title"
      >
        <div className="success-popup-icon">
          <svg viewBox="0 0 52 52" aria-hidden="true">
            <circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />

            <path
              d="M14 27 L22 35 L39 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 id="success-popup-title">{title}</h2>

        <p>{message}</p>

        <button
          type="button"
          className="success-popup-button"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;