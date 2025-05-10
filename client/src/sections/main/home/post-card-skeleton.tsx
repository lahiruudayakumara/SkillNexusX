import React from "react";

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="h-6 bg-gray-300 rounded w-3/4"></div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>

      <div className="text-right">
        <div className="h-3 w-32 bg-gray-200 rounded ml-auto"></div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCardSkeleton;
