import React from "react";

export default function UpflyoverLogo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-700 to-teal-500">
      <div className="flex flex-col items-center">
        {/* Logo Symbol */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-40 h-40 mb-6"
          fill="none"
        >
          <path
            d="M100 20 L180 160 L20 160 Z"
            className="fill-white"
          />
          <path
            d="M100 20 L140 90 L60 90 Z"
            className="fill-teal-700"
          />
          <polygon
            points="100,70 120,110 80,110"
            className="fill-white"
          />
        </svg>

        {/* Logo Text */}
        <h1 className="text-4xl font-bold text-white tracking-wide">
          Upflyover
        </h1>
      </div>
    </div>
  );
}