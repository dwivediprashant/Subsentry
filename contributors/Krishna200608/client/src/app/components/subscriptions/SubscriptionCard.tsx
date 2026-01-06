'use client';

import { Subscription } from '@/lib/api';
import {
  cn,
  formatCurrency,
  formatDate,
  getDaysUntilRenewal,
  isUrgentRenewal,
  getCategoryColor,
  getStatusColor,
  getBillingCycleLabel,
  getSourceIcon,
} from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  AlertTriangle,
  MoreVertical,
  ExternalLink,
  Pause,
  Trash2,
  Edit,
} from 'lucide-react';
import { useState } from 'react';

interface SubscriptionCardProps {
  subscription: Subscription;
  view?: 'grid' | 'list';
}

export default function SubscriptionCard({ subscription, view = 'grid' }: SubscriptionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const daysUntil = getDaysUntilRenewal(subscription.renewalDate);
  const isUrgent = isUrgentRenewal(subscription.renewalDate);
  const categoryColors = getCategoryColor(subscription.category);
  const statusColors = getStatusColor(subscription.status);

  const initials = subscription.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getRenewalText = () => {
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `${daysUntil} days`;
  };

  if (view === 'list') {
    return (
      <div
        className={cn(
          'group flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl border transition-all duration-200 hover:bg-[#141414]',
          isUrgent ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
        )}
      >
        {/* Icon/Logo */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
          categoryColors.bg,
          categoryColors.text
        )}>
          {initials}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">{subscription.name}</h3>
            {subscription.isTrial && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">
                Trial
              </span>
            )}
            <span className="text-xs text-gray-500">{getSourceIcon(subscription.source)}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors.bg, categoryColors.text)}>
              {subscription.category}
            </span>
            <span className="text-xs text-gray-500">
              {getBillingCycleLabel(subscription.billingCycle)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right hidden sm:block">
          <div className="font-semibold text-white">
            {formatCurrency(subscription.amount, subscription.currency)}
          </div>
          <div className="text-xs text-gray-500">
            /{subscription.billingCycle === 'yearly' ? 'year' : subscription.billingCycle === 'weekly' ? 'week' : 'month'}
          </div>
        </div>

        {/* Renewal Date */}
        <div className={cn(
          'text-right hidden md:block',
          isUrgent ? 'text-amber-400' : 'text-gray-400'
        )}>
          <div className="flex items-center gap-1.5 justify-end">
            {isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
            <span className="text-sm font-medium">{getRenewalText()}</span>
          </div>
          <div className="text-xs text-gray-500">{formatDate(subscription.renewalDate)}</div>
        </div>

        {/* Status Badge */}
        <div className={cn(
          'px-3 py-1 rounded-full text-xs font-medium capitalize hidden lg:block',
          statusColors.bg,
          statusColors.text
        )}>
          {subscription.status}
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] shadow-xl z-20 py-1">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] flex items-center gap-2">
                  <Pause className="w-4 h-4" /> Pause
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Visit Site
                </button>
                <hr className="my-1 border-[#2a2a2a]" />
                <button className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={cn(
        'group relative p-5 bg-[#0f0f0f] rounded-xl border transition-all duration-200 hover:bg-[#141414] hover:shadow-lg hover:shadow-black/20',
        isUrgent ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
      )}
    >
      {/* Urgent Banner */}
      {isUrgent && (
        <div className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-b-full" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold',
          categoryColors.bg,
          categoryColors.text
        )}>
          {initials}
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium capitalize',
            statusColors.bg,
            statusColors.text
          )}>
            {subscription.status}
          </span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white truncate">{subscription.name}</h3>
          {subscription.isTrial && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full flex-shrink-0">
              Trial
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors.bg, categoryColors.text)}>
            {subscription.category}
          </span>
          <span className="text-xs text-gray-500">{getSourceIcon(subscription.source)}</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-white">
          {formatCurrency(subscription.amount, subscription.currency)}
        </div>
        <div className="text-sm text-gray-500">
          {getBillingCycleLabel(subscription.billingCycle)}
        </div>
      </div>

      {/* Renewal */}
      <div className={cn(
        'flex items-center justify-between pt-4 border-t border-[#1a1a1a]',
        isUrgent ? 'text-amber-400' : 'text-gray-400'
      )}>
        <div className="flex items-center gap-2">
          {isUrgent ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          <span className="text-sm">
            {isUrgent ? 'Renews ' : ''}{getRenewalText()}
          </span>
        </div>
        <span className="text-xs text-gray-500">{formatDate(subscription.renewalDate)}</span>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-4 top-16 w-40 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] shadow-xl z-20 py-1">
            <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] flex items-center gap-2">
              <Pause className="w-4 h-4" /> Pause
            </button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Visit Site
            </button>
            <hr className="my-1 border-[#2a2a2a]" />
            <button className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[#2a2a2a] flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
