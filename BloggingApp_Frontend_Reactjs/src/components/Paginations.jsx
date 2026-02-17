// src/components/Paginations.jsx
import React from "react";

const Paginations = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // agar ek hi page hai, pagination dikhane ki zarurat nahi

  // Page numbers dikhane ke liye simple logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // ek time me kitne page buttons dikhne chahiye
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-10 space-x-2 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white shadow"
        }`}
      >
        Previous
      </button>

      {/* Page Number Buttons */}
      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            num === currentPage
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white shadow"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Paginations;
