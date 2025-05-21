// PaymentCancel.js

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const PaymentCancel = () => {
  const { paymentIntentId } = useParams();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-red-600">Payment Canceled</h2>
        <p className="text-lg text-gray-500 text-center">Your payment was not completed. Please try again.</p>
        {paymentIntentId && (
          <p className="text-center text-sm text-gray-400 mt-2">
            Payment ID: <code>{paymentIntentId}</code>
          </p>
        )}
        <div className="mt-4 text-center">
          <p className="text-md text-gray-700">If you would like to retry, click below:</p>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/courses"
            className="text-blue-500 hover:text-blue-700 font-semibold text-lg"
          >
            Retry Payment
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Or go back to the homepage: <Link to="/" className="text-blue-500">Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;

