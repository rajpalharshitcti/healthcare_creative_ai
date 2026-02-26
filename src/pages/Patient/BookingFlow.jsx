import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/bookingFlow.css";

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goNext = () => {
    if (step === 1 && !date) {
      setError("Please select a date");
      return;
    }
    if (step === 2 && !slot) {
      setError("Please select a time slot");
      return;
    }
    if (step === 4) {
      if (!cardNumber.trim()) {
        setError("Please enter a card number");
        return;
      }
      if (!cardName.trim()) {
        setError("Please enter the cardholder name");
        return;
      }
    }
    setError("");
    setStep((s) => s + 1);
  };

  const onDateChange = (value) => {
    setDate(value);
    if (error && value) setError("");
  };

  const onSlotChange = (value) => {
    setSlot(value);
    if (error && value) setError("");
  };

  const onCardNumberChange = (value) => {
    setCardNumber(value);
    if (error && value.trim()) setError("");
  };

  const onCardNameChange = (value) => {
    setCardName(value);
    if (error && value.trim()) setError("");
  };

  return (
    <div className="panel booking-flow page-fade">
      <h2>Appointment Booking</h2>
      <p className="step-line">Step {step} of 5</p>

      {step === 1 ? <div><h3>Select Date</h3><input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} /></div> : null}
      {step === 2 ? <div><h3>Select Time Slot</h3><select value={slot} onChange={(e) => onSlotChange(e.target.value)}><option value="">Select slot</option><option>10:00 AM</option><option>12:30 PM</option><option>5:00 PM</option></select></div> : null}
      {step === 3 ? <div><h3>Confirm Details</h3><p>Doctor: Dr. Arjun Mehta | Mode: Video | Fee: INR 700</p></div> : null}
      {step === 4 ? <div><h3>Payment (Mock)</h3><input placeholder="Card number" value={cardNumber} onChange={(e) => onCardNumberChange(e.target.value)} /><input placeholder="Name on card" value={cardName} onChange={(e) => onCardNameChange(e.target.value)} /></div> : null}
      {step === 5 ? <div><h3>Review & Submit</h3><p>All details are ready. Complete booking now.</p></div> : null}
      {error ? <small className="field-error">{error}</small> : null}

      <div className="step-actions">
        <button className="btn-ghost" onClick={() => { setError(""); setStep((s) => Math.max(1, s - 1)); }}>Back</button>
        {step < 5 ? (
          <button className="btn-primary" onClick={goNext}>Continue</button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/patient/book/success")}>Finish</button>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;

