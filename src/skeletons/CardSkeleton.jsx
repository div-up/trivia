import React from "react";

const PulseBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`} />
);

const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <PulseBox className="w-10 h-10 rounded-full mr-4" />
      <div>
        <PulseBox className="w-24 h-4" />
        <PulseBox className="w-32 h-6 mt-2" />
      </div>
    </div>
    <PulseBox className="mt-4 w-32 h-4" />
  </div>
);

export default CardSkeleton;