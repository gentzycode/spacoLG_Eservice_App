import React from 'react';

export const SkeletonStatCard = () => (
    <div className="bg-white rounded-xl shadow-sm border-t-4 border-gray-200 p-6 animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

export const SkeletonRevenueHeadCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-28"></div>
                    </div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    </div>
);

export const SkeletonLoader = () => (
    <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <SkeletonStatCard key={i} />
            ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <SkeletonRevenueHeadCard key={i} />
            ))}
        </div>
    </div>
);
