import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';  // adjust import path

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { paymentIntentId } = useParams();

  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  // Get courseSlug from localStorage or any other place you saved it before payment
  const courseSlug = localStorage.getItem('courseSlug'); // adjust if stored elsewhere

  useEffect(() => {
    if (!courseSlug) {
      setError('Missing course information.');
      setChecking(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 12; // 1 min max with 5 sec interval
    const interval = 5000;  // 5 seconds

    const checkEnrollment = async () => {
      attempts++;
      try {
        const response = await axiosInstance.get(`/course/enrolled/${courseSlug}`);

        if (response.data.enrolled) {
          navigate('/enrolledCOurse'); // redirect once enrollment confirmed
        } else if (attempts >= maxAttempts) {
          setError('Payment confirmation taking longer than expected. Please contact support.');
          setChecking(false);
        }
        // else keep polling
      } catch (err) {
        setError('Error checking enrollment status.');
        setChecking(false);
      }
    };

    checkEnrollment(); // initial check
    const timerId = setInterval(checkEnrollment, interval);

    return () => clearInterval(timerId);
  }, [courseSlug, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-6">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-center text-green-600">Payment Successful!</h2>
          <p className="text-lg text-gray-500 text-center">
            Waiting for payment confirmation...
          </p>
          {paymentIntentId && (
            <p className="text-sm text-gray-400 text-center mt-2">
              Payment ID: <code>{paymentIntentId}</code>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 py-12 px-6">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border border-red-300">
          <h2 className="text-3xl font-extrabold text-center text-red-600">Payment Processing Issue</h2>
          <p className="text-lg text-gray-700 text-center">{error}</p>
          <p className="text-md text-gray-500 text-center mt-4">
            Please contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  return null; // should not reach here
};

export default PaymentSuccess;


