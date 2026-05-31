"use client";
import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10} products
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            currentPage === 1
              ? "text-gray-400 bg-gray-50 dark:bg-gray-800/30 dark:text-gray-600"
              : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 rtl:rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="ml-2">Previous</span>
        </button>

        {/* Page Info */}
        <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            currentPage === totalPages
              ? "text-gray-400 bg-gray-50 dark:bg-gray-800/30 dark:text-gray-600"
              : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <span className="mr-2">Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 ltr:rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5L8.25 19.5"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}