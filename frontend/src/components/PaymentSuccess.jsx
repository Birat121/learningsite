// PaymentSuccess.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // Redirect the user to the enrolled courses page after 5 seconds
  useEffect(() => {
    setTimeout(() => {
      navigate('/enrolledcourses');  // Adjust to the actual route for enrolled courses
    }, 5000); // Redirect after 5 seconds
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-green-600">Payment Successful!</h2>
        <p className="text-lg text-gray-500 text-center">Thank you for your purchase. Your payment was successfully processed.</p>
        <div className="mt-4 text-center">
          <p className="text-md text-gray-700">You will be redirected to your enrolled courses shortly...</p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">If you are not redirected automatically, <a href="/user/enrolled-courses" className="text-blue-500">click here</a> to go to your courses.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
