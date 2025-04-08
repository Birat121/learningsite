import React, { useState } from "react";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            {isSignIn ? "Sign in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignIn ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="bg-white py-6 px-4 sm:px-8 shadow sm:rounded-lg">
          <form className="space-y-6" method="POST">
            {!isSignIn && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email address"
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {isSignIn && (
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-900">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot your password?
                </a>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-[rgb(0,104,80)] hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(0,104,80)]"
              >
                {isSignIn ? "Sign in" : "Create account"}
              </button>
            </div>
          </form>

          {/* Divider and social sign-in */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  {isSignIn ? "Or sign in with" : "Or sign up with"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {/* Social Buttons */}
              {[
                {
                  name: "Facebook",
                  img: "https://www.svgrepo.com/show/512120/facebook-176.svg",
                },
                {
                  name: "Twitter",
                  img: "https://www.svgrepo.com/show/513008/twitter-154.svg",
                },
                {
                  name: "Google",
                  img: "https://www.svgrepo.com/show/475656/google-color.svg",
                },
              ].map((provider) => (
                <a
                  key={provider.name}
                  href="#"
                  className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
                >
                  <img
                    src={provider.img}
                    alt={provider.name}
                    className="h-5 w-5"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
