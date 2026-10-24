import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { PropertyType, SearchFilters } from '../types/hotel.ts';
import { ALL_AMENITIES } from '../data/hotelsData.ts';

import { formatPrice } from '../utils/bookingLogic.ts';

interface FilterBarProps {
  filters: SearchFilters;
  onChangeFilters: (newFilters: SearchFilters) => void;
  onResetFilters: () => void;
  resultsCount: number;
  currency?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  resultsCount,
  currency = 'INR',
}) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const toggleStarRating = (star: number) => {
    const exists = filters.starRatings.includes(star);
    const updated = exists
      ? filters.starRatings.filter((s) => s !== star)
      : [...filters.starRatings, star];
    onChangeFilters({ ...filters, starRatings: updated });
  };

  const togglePropertyType = (type: PropertyType) => {
    const exists = filters.propertyTypes.includes(type);
    const updated = exists
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];
    onChangeFilters({ ...filters, propertyTypes: updated });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.selectedAmenities.includes(amenity);
    const updated = exists
      ? filters.selectedAmenities.filter((a) => a !== amenity)
      : [...filters.selectedAmenities, amenity];
    onChangeFilters({ ...filters, selectedAmenities: updated });
  };

  const activeFiltersCount =
    filters.starRatings.length +
    filters.propertyTypes.length +
    filters.selectedAmenities.length +
    (filters.minPrice > 100 || filters.maxPrice < 1000 ? 1 : 0);

  return (
    <div className="bg-stone-100 border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Segmented Property Type / Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-medium text-stone-500 whitespace-nowrap shrink-0 mr-1">
            Property:
          </span>
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, propertyTypes: [] })}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filters.propertyTypes.length === 0
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Types
          </button>
          {(['Resort', 'Boutique', 'Chalet', 'Villa'] as PropertyType[]).map((type) => {
            const active = filters.propertyTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => togglePropertyType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {type}
              </button>
            );
          })}

          <div className="h-4 w-px bg-stone-300 mx-1 shrink-0" />

          {/* Quick 5-Star filter button */}
          <button
            type="button"
            onClick={() => toggleStarRating(5)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              filters.starRatings.includes(5)
                ? 'bg-amber-600 text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span className="text-amber-500 font-bold">5★</span>
            <span>Luxury</span>
          </button>

          {/* All Filters Dialog Opener */}
          <button
            type="button"
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span>More Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-mono">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Side: Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-stone-500 whitespace-nowrap">
            <strong className="text-stone-800 font-semibold tabular-nums">{resultsCount}</strong> {resultsCount === 1 ? 'property' : 'properties'} found
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-stone-500 whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    sortBy: e.target.value as SearchFilters['sortBy'],
                  })
                }
                className="bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-lg px-2.5 py-1.5 hover:border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Guest Rating</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1 px-2 py-1.5 rounded hover:bg-stone-200 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Filters Drawer / Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h2 className="font-serif-luxury text-xl font-semibold text-stone-900">
                Filter Properties
              </h2>
              <button
                type="button"
                onClick={() => setShowFiltersModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Price Range */}
            <div className="py-4 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-900">Price per night</span>
                <span className="text-xs font-mono font-medium text-stone-700">
                  {formatPrice(filters.minPrice, currency)} - {formatPrice(filters.maxPrice, currency)}+
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="min-price-input" className="text-xs text-stone-500 block mb-1">Min Price ($)</label>
                  <input
                    id="min-price-input"
                    type="number"
                    min="100"
                    max={filters.maxPrice - 50}
                    step="50"
                    value={filters.minPrice}
                    onChange={(e) =>
                      onChangeFilters({
                        ...filters,
                        minPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="max-price-input" className="text-xs text-stone-500 block mb-1">Max Price ($)</label>
                  <input
                    id="max-price-input"
                    type="number"
                    min={filters.minPrice + 50}
                    max="1500"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      onChangeFilters({
                        ...filters,
                        maxPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="py-4 border-b border-stone-100">
              <p className="text-sm font-medium text-stone-900 mb-2">Star Rating</p>
              <div className="flex gap-2">
                {[5, 4, 3].map((star) => {
                  const active = filters.starRatings.includes(star);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => toggleStarRating(star)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                        active
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span>★</span>
                      <span>{star} Stars</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="py-4">
              <p className="text-sm font-medium text-stone-900 mb-2">Required Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {ALL_AMENITIES.map((amenity) => {
                  const selected = filters.selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors border ${
                        selected
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${selected ? 'bg-amber-400 text-stone-900' : 'border border-stone-300'}`}>
                        {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs text-stone-500 hover:text-stone-900 underline"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setShowFiltersModal(false)}
                className="py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg shadow-sm"
              >
                Show {resultsCount} Properties
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
