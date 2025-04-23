// PayPalSuccess.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const PayPalSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const captureOrder = async () => {
      const token = params.get("token");
      const courseId = params.get("courseId");

      try {
        await axiosInstance.get(`/payment/capture-payment/success?token=${token}&courseId=${courseId}`);
        alert("Payment successful! You are now enrolled.");
        navigate(`/courses/enrolled`);
      } catch (err) {
        alert("Payment failed or already captured.");
        navigate("/courses");
      }
    };

    captureOrder();
  }, [params, navigate]);

  return <div className="pt-28 text-center text-lg text-green-600">Finalizing payment...</div>;
};

export default PayPalSuccess;
