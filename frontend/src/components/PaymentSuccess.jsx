import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { paymentIntentId } = useParams();

  useEffect(() => {
    // You could use paymentIntentId here for any verification or fetching payment status if needed

    setTimeout(() => {
      navigate('/enrolledCourse');  // Redirect after 5 seconds
    }, 5000);
  }, [navigate, paymentIntentId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-green-600">Payment Successful!</h2>
        <p className="text-lg text-gray-500 text-center">
          Thank you for your purchase. Your payment was successfully processed.
        </p>
        {paymentIntentId && (
          <p className="text-sm text-gray-400 text-center mt-2">
            Payment ID: <code>{paymentIntentId}</code>
          </p>
        )}
        <div className="mt-4 text-center">
          <p className="text-md text-gray-700">You will be redirected to your enrolled courses shortly...</p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If you are not redirected automatically, <a href="/enrolledCourse" className="text-blue-500">click here</a> to go to your courses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

