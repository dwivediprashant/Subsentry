'use client';

import { cn } from '@/lib/utils';
import { Filter, X } from 'lucide-react';

export type FilterStatus = 'all' | 'active' | 'paused' | 'cancelled';
export type FilterBillingCycle = 'all' | 'monthly' | 'yearly' | 'weekly' | 'custom';
export type FilterCategory = 'all' | 'entertainment' | 'music' | 'education' | 'productivity' | 'finance' | 'health' | 'other';

interface FilterBarProps {
  statusFilter: FilterStatus;
  billingCycleFilter: FilterBillingCycle;
  categoryFilter: FilterCategory;
  onStatusChange: (status: FilterStatus) => void;
  onBillingCycleChange: (cycle: FilterBillingCycle) => void;
  onCategoryChange: (category: FilterCategory) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
];

const billingCycleOptions: { value: FilterBillingCycle; label: string }[] = [
  { value: 'all', label: 'All Cycles' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

const categoryOptions: { value: FilterCategory; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'music', label: 'Music' },
  { value: 'education', label: 'Education' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'finance', label: 'Finance' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

export default function FilterBar({
  statusFilter,
  billingCycleFilter,
  categoryFilter,
  onStatusChange,
  onBillingCycleChange,
  onCategoryChange,
  onClearFilters,
  activeFiltersCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Filters</span>
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
          className={cn(
            'appearance-none px-3 py-2 pr-8 text-sm rounded-lg border bg-[#0f0f0f] outline-none cursor-pointer transition-colors',
            statusFilter !== 'all'
              ? 'border-blue-500/50 text-blue-400'
              : 'border-[#2a2a2a] text-gray-300 hover:border-[#3a3a3a]'
          )}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Billing Cycle Filter */}
      <div className="relative">
        <select
          value={billingCycleFilter}
          onChange={(e) => onBillingCycleChange(e.target.value as FilterBillingCycle)}
          className={cn(
            'appearance-none px-3 py-2 pr-8 text-sm rounded-lg border bg-[#0f0f0f] outline-none cursor-pointer transition-colors',
            billingCycleFilter !== 'all'
              ? 'border-blue-500/50 text-blue-400'
              : 'border-[#2a2a2a] text-gray-300 hover:border-[#3a3a3a]'
          )}
        >
          {billingCycleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative hidden md:block">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as FilterCategory)}
          className={cn(
            'appearance-none px-3 py-2 pr-8 text-sm rounded-lg border bg-[#0f0f0f] outline-none cursor-pointer transition-colors',
            categoryFilter !== 'all'
              ? 'border-blue-500/50 text-blue-400'
              : 'border-[#2a2a2a] text-gray-300 hover:border-[#3a3a3a]'
          )}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Clear ({activeFiltersCount})
        </button>
      )}
    </div>
  );
}
