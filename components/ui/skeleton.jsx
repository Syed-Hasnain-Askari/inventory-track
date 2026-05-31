import React from "react";

export function Skeleton({
  className = "",
  width = "100%",
  height = "1rem",
  borderRadius = "0.25rem"
}) {
  return (
    <div
      className={`${className} animate-pulse bg-gray-200 dark:bg-gray-700 rounded-${borderRadius === "full" ? "full" : borderRadius} w-[${width}] h-[${height}]`}
    />
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="p-4">
        <Skeleton width="48px" height="48px" borderRadius="0.5rem" />
      </td>
      <td className="p-4">
        <Skeleton width="60%" />
        <Skeleton className="mt-2" width="40%" height="0.75rem" />
      </td>
      <td className="hidden md:table-cell p-4">
        <Skeleton width="50%" />
      </td>
      <td className="hidden md:table-cell p-4">
        <Skeleton width="50%" />
      </td>
      <td className="hidden md:table-cell p-4">
        <Skeleton width="50%" />
      </td>
      <td className="p-4 text-right">
        <Skeleton width="40%" />
      </td>
      <td className="p-4 text-center">
        <Skeleton width="30%" className="inline-block" />
      </td>
      <td className="hidden md:table-cell p-4 text-center">
        <Skeleton width="40%" />
      </td>
      <td className="hidden md:table-cell p-4 text-center">
        <Skeleton width="40%" />
      </td>
      <td className="p-4 text-right space-x-2">
        <div className="flex items-center space-x-2">
          <Skeleton width="24px" height="24px" borderRadius="full" />
          <Skeleton width="24px" height="24px" borderRadius="full" />
        </div>
      </td>
    </tr>
  );
}

export function SkeletonTable({ rows = 3 }) {
  return (
    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="p-4 w-16">
            <span className="sr-only">Image</span>
          </th>
          <th className="p-4">Product Image</th>
          <th className="hidden md:table-cell p-4">Product Name</th>
          <th className="hidden md:table-cell p-4">SKU</th>
          <th className="hidden md:table-cell p-4">Category</th>
          <th className="p-4 text-sm text-right">Price</th>
          <th className="p-4 text-sm text-center">Stock</th>
          <th className="hidden md:table-cell p-4 text-sm text-center">Status</th>
          <th className="hidden md:table-cell p-4 text-sm text-center">Last Updated</th>
          <th className="p-4 w-16 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTableRow key={index} />
        ))}
      </tbody>
    </table>
  );
}