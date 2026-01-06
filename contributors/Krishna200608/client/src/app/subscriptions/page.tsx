'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import {
  SubscriptionCard,
  FilterBar,
  SortDropdown,
  ViewToggle,
  EmptyState,
  QuickStats,
  FilterStatus,
  FilterBillingCycle,
  FilterCategory,
  SortField,
  SortOrder,
} from '../components/subscriptions';
import { Subscription } from '@/lib/api';
import { cn } from '@/lib/utils';

// Mock data for demonstration (will be replaced with real API call)
const mockSubscriptions: Subscription[] = [
  {
    _id: '1',
    userId: 'user1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'entertainment',
    renewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
    isTrial: false,
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    userId: 'user1',
    name: 'Spotify Premium',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'music',
    renewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
    isTrial: false,
    source: 'gmail',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    userId: 'user1',
    name: 'Adobe Creative Cloud',
    amount: 54.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days
    isTrial: false,
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    userId: 'user1',
    name: 'ChatGPT Plus',
    amount: 20.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day - urgent!
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    userId: 'user1',
    name: 'GitHub Copilot',
    amount: 10.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days
    isTrial: false,
    source: 'imported',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    userId: 'user1',
    name: 'Notion',
    amount: 8.00,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'productivity',
    renewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days
    isTrial: false,
    source: 'manual',
    status: 'paused',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '7',
    userId: 'user1',
    name: 'Disney+',
    amount: 7.99,
    currency: 'USD',
    billingCycle: 'monthly',
    category: 'entertainment',
    renewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days
    isTrial: false,
    source: 'gmail',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '8',
    userId: 'user1',
    name: 'Coursera Plus',
    amount: 59.00,
    currency: 'USD',
    billingCycle: 'yearly',
    category: 'education',
    renewalDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    source: 'manual',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function SubscriptionsPage() {
  const { getToken } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [billingCycleFilter, setBillingCycleFilter] = useState<FilterBillingCycle>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');

  // Sort state
  const [sortField, setSortField] = useState<SortField>('renewalDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        // In production, use the API:
        // const token = await getToken();
        // const data = await getSubscriptions(token!);
        // setSubscriptions(data.subscriptions);
        
        // For demo, use mock data:
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
        setSubscriptions(mockSubscriptions);
      } catch (err) {
        setError('Failed to load subscriptions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [getToken]);

  // Calculate active filters count
  const activeFiltersCount = [
    statusFilter !== 'all',
    billingCycleFilter !== 'all',
    categoryFilter !== 'all',
  ].filter(Boolean).length;

  // Filter and sort subscriptions
  const filteredAndSortedSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Apply filters
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }
    if (billingCycleFilter !== 'all') {
      result = result.filter(s => s.billingCycle === billingCycleFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter(s => s.category === categoryFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'renewalDate':
          comparison = new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [subscriptions, statusFilter, billingCycleFilter, categoryFilter, sortField, sortOrder]);

  const clearFilters = () => {
    setStatusFilter('all');
    setBillingCycleFilter('all');
    setCategoryFilter('all');
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubscriptions(mockSubscriptions);
    setIsLoading(false);
  };

  return (
    <DashboardLayout title="Subscriptions" subtitle="Manage all your recurring payments">
      {/* Quick Stats */}
      {!isLoading && subscriptions.length > 0 && (
        <div className="mb-6">
          <QuickStats subscriptions={subscriptions} />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <FilterBar
          statusFilter={statusFilter}
          billingCycleFilter={billingCycleFilter}
          categoryFilter={categoryFilter}
          onStatusChange={setStatusFilter}
          onBillingCycleChange={setBillingCycleFilter}
          onCategoryChange={setCategoryFilter}
          onClearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <div className="flex items-center gap-3">
          <SortDropdown
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={setSortField}
            onOrderToggle={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
          />

          <ViewToggle view={view} onViewChange={setView} />

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#3a3a3a] transition-colors text-gray-400 hover:text-white disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400">Loading your subscriptions...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredAndSortedSubscriptions.length === 0 ? (
        subscriptions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-400 mb-4">No subscriptions match your filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredAndSortedSubscriptions.length} of {subscriptions.length} subscriptions
          </div>

          {/* Subscription Grid/List */}
          <div className={cn(
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          )}>
            {filteredAndSortedSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                view={view}
              />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
