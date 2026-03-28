import { useState } from "react";
import useAuthStore from "./authStore";

const usePhoneAuth = (onSuccess) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { sendOtp, verifyOtp } = useAuthStore();

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError("Phone number required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp(phoneNumber);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyOtp(phoneNumber, otp);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    step,
    setStep,
    loading,
    error,
    handleSendOtp,
    handleVerifyOtp,
  };
};

export default usePhoneAuth;
