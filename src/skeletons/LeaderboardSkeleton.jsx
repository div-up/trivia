import React from "react";
import CardSkeleton from "./CardSkeleton";

const PulseBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`}></div>
);

const TableCellSkeleton = ({ width = "w-32" }) => (
  <td className="px-6 py-4 whitespace-nowrap">
    <PulseBox className={`${width} h-4 mx-auto`} />
  </td>
);

const LeaderboardSkeleton = () => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex bg-gray-100 rounded-lg py-1 mb-3">
            <PulseBox className="px-10 py-2 rounded-md" />
          </div>
          <div className="relative mb-4">
            <PulseBox className="pl-10 pr-10 py-5 border border-gray-300 rounded-lg w-full md:w-64" />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-800 flex items-center">
              <PulseBox className="w-6 h-6 rounded-full mr-2" />
              <PulseBox className="w-32 h-6" />
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[16, 32, 32, 32, 32].map((w, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <PulseBox className={`w-${w} h-4`} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PulseBox className="w-10 h-10 rounded-full mx-auto" />
                  </td>
                  {[...Array(4)].map((_, i) => (
                    <TableCellSkeleton
                      key={i}
                      width={i < 2 ? "w-32" : "w-20"}
                    />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
