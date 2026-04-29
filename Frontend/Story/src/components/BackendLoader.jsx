import React from "react";

export default function BackendLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">

        <span className="loading loading-spinner loading-lg"></span>

        <h2 className="text-xl font-semibold mt-4">
          Waking up server...
        </h2>

        <p className="text-gray-500 mt-2">
          Please wait, backend is starting ☕
        </p>

      </div>
    </div>
  );
}