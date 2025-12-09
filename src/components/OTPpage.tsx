import { useState } from "react";
import { supabase } from "../supabaseClient";

interface OTPProps {
  email: string;
  goToLogin: () => void;
}

export default function OTPPage({ email, goToLogin }: OTPProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "magiclink", // OTP login works under this type
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess("Login successful!");
      setTimeout(() => {
        goToLogin();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Enter OTP</h2>
        <p>We sent a 6-digit code to:</p>
        <strong>{email}</strong>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="auth-input"
        />

        <button onClick={handleVerify} disabled={loading} className="auth-button">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <button className="auth-back" onClick={goToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}
