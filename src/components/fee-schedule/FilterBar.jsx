import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const FilterBar = ({
    searchQuery,
    onSearchChange,
    showFilters,
    onToggleFilters,
    activeFilters = [],
    onRemoveFilter,
    onClearAll
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by name, code, category, or description..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Filter Button and Active Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={onToggleFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FaFilter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilters.length > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-white bg-[#3B78BD] rounded-full">
                            {activeFilters.length}
                        </span>
                    )}
                </button>

                {/* Active Filter Chips */}
                {activeFilters.map((filter, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#3B78BD] bg-blue-50 rounded-full"
                    >
                        <span>{filter.label}: {filter.value}</span>
                        <button
                            onClick={() => onRemoveFilter(filter.key)}
                            className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <FaTimes className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                {activeFilters.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
