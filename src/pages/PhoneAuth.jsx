import usePhoneAuth from "../store/usePhoneAuth";

const PhoneAuth = ({ onSuccess, onCancel }) => {
  const {
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
  } = usePhoneAuth(onSuccess);

  return (
    <div className="w-full">
      {step === "phone" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Phone Number (with country code)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+919876543210"
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button onClick={onCancel} className="w-full text-sm underline">
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 border rounded-xl text-center"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={() => setStep("phone")}
            className="w-full text-sm underline"
          >
            Change Number
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneAuth;
