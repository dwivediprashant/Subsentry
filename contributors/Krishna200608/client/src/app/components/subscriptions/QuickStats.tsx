'use client';

import { Subscription } from '@/lib/api';
import { formatCurrency, isUrgentRenewal, getDaysUntilRenewal } from '@/lib/utils';
import { DollarSign, CreditCard, AlertTriangle, Clock } from 'lucide-react';

interface QuickStatsProps {
  subscriptions: Subscription[];
}

export default function QuickStats({ subscriptions }: QuickStatsProps) {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  
  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === 'monthly') return sum + sub.amount;
    if (sub.billingCycle === 'yearly') return sum + (sub.amount / 12);
    if (sub.billingCycle === 'weekly') return sum + (sub.amount * 4.33);
    return sum + sub.amount;
  }, 0);

  const yearlyTotal = monthlyTotal * 12;

  const urgentRenewals = subscriptions.filter(s => 
    s.status === 'active' && isUrgentRenewal(s.renewalDate)
  ).length;

  const trialsEnding = subscriptions.filter(s => 
    s.isTrial && s.trialEndsAt && getDaysUntilRenewal(s.trialEndsAt) <= 7
  ).length;

  const stats = [
    {
      label: 'Monthly Spend',
      value: formatCurrency(monthlyTotal),
      icon: DollarSign,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      change: `${formatCurrency(yearlyTotal)}/year`,
    },
    {
      label: 'Active Subscriptions',
      value: activeSubscriptions.length.toString(),
      icon: CreditCard,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      change: `${subscriptions.length} total`,
    },
    {
      label: 'Urgent Renewals',
      value: urgentRenewals.toString(),
      icon: AlertTriangle,
      iconBg: urgentRenewals > 0 ? 'bg-amber-500/20' : 'bg-gray-500/20',
      iconColor: urgentRenewals > 0 ? 'text-amber-400' : 'text-gray-400',
      change: 'Next 3 days',
      highlight: urgentRenewals > 0,
    },
    {
      label: 'Trials Ending',
      value: trialsEnding.toString(),
      icon: Clock,
      iconBg: trialsEnding > 0 ? 'bg-purple-500/20' : 'bg-gray-500/20',
      iconColor: trialsEnding > 0 ? 'text-purple-400' : 'text-gray-400',
      change: 'Within 7 days',
      highlight: trialsEnding > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-4 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className={`text-xs ${stat.highlight ? stat.iconColor : 'text-gray-500'}`}>
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
