import { SubscriptionData } from "../subscriptions/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface SubscriptionCardProperties {
  subscription: SubscriptionData;
  isUrgent: boolean;
  onEdit: (subscription: SubscriptionData) => void;
  onDelete: (subscription: SubscriptionData) => void;
}

export default function SubscriptionCard({
  subscription,
  isUrgent,
  onEdit,
  onDelete,
}: SubscriptionCardProperties) {
  // Returns a badge for the subscription status, with special handling for trial
  const getStatusBadge = () => {
    if (subscription.serviceStatus === "trial") {
      // Highlight trial badge, especially if ending soon
      let trialSoon = false;
      let trialEndsText = "Trial";
      if (subscription.trialEndDate) {
        const end = new Date(subscription.trialEndDate);
        const now = new Date();
        const days = Math.ceil(
          (end.getTime() - now.getTime()) / (1000 * 3600 * 24),
        );
        if (days <= 3) trialSoon = true;
        if (days > 1) trialEndsText = `Trial ends in ${days} days`;
        else if (days === 1) trialEndsText = "Trial ends tomorrow";
        else if (days === 0) trialEndsText = "Trial ends today";
        else if (days < 0) trialEndsText = "Trial ended";
        else
          trialEndsText = `Trial ends on ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
      }
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200
            ${trialSoon ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30 animate-pulse" : "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"}
          `}
          style={{ minWidth: 80, justifyContent: "center" }}
        >
          {trialEndsText}
        </span>
      );
    }
    switch (subscription.serviceStatus) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
            Active
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#737373]/20 text-[#737373] border border-[#737373]/30">
            Cancelled
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getRenewalDateDisplay = () => {
    const renewalDate = new Date(subscription.upcomingRenewal);
    const today = new Date();
    const daysUntilRenewal = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );

    if (daysUntilRenewal === 0) return "Today";
    if (daysUntilRenewal === 1) return "Tomorrow";
    if (daysUntilRenewal <= 3) return `In ${daysUntilRenewal} days`;
    if (daysUntilRenewal <= 7) return `In ${daysUntilRenewal} days`;

    return renewalDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getBillingIntervalDisplay = () => {
    switch (subscription.billingInterval) {
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      case "weekly":
        return "Weekly";
      default:
        return subscription.billingInterval;
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-[#191919] to-[#282828] rounded-xl border h-full relative border-[#2A2A2A]/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:border-[#FFDE21] hover:scale-[1.02] cursor-pointer flex flex-col`}
    >
      {/* Status Badge Ribbon */}
      <div className="absolute -top-2 -right-2 z-10">{getStatusBadge()}</div>
      {/* Header with logo, status and urgent indicator */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <img
            src={subscription.logoUrl}
            alt={subscription.serviceName}
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                subscription.serviceName,
              )}&background=191919&color=ffffff&size=48`;
            }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-1">
              {subscription.serviceName}
            </h3>
            <p className="text-sm text-[#B3B3B3]">
              {subscription.serviceCategory}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isUrgent && (
            <div className="flex items-center gap-1 text-[#EF4444]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">Urgent</span>
            </div>
          )}
        </div>
      </div>

      {/* Cost and billing info */}
      <div className="flex items-baseline justify-between mb-4 mt-auto">
        <div>
          <span className="text-2xl font-bold text-[#FFFFFF]">
            ${subscription.cost.toFixed(2)}
          </span>
          <span className="text-sm text-[#B3B3B3] ml-2">
            /{getBillingIntervalDisplay().toLowerCase()}
          </span>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-medium ${
              isUrgent ? "text-[#F59E0B]" : "text-[#06B6D4]"
            }`}
          >
            {getRenewalDateDisplay()}
          </div>
          <div className="text-xs text-[#B3B3B3]">Renewal</div>
        </div>
      </div>

      {/* Trial information, always visible and robust */}
      {subscription.serviceStatus === "trial" && (
        <div className="rounded-lg p-3 mb-4 flex flex-col gap-1 bg-yellow-400/90 border-2 border-yellow-500 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-yellow-900 text-lg">⏱</span>
            <span className="text-yellow-900 text-base font-bold">
              Trial period active
            </span>
          </div>
          <div className="text-xs text-yellow-900 font-semibold mt-1">
            {(() => {
              const end = subscription.trialEndDate
                ? new Date(subscription.trialEndDate)
                : new Date(subscription.upcomingRenewal);
              const now = new Date();
              const days = Math.ceil(
                (end.getTime() - now.getTime()) / (1000 * 3600 * 24),
              );
              if (days > 1) return `Trial ends in ${days} days`;
              if (days === 1) return "Trial ends tomorrow";
              if (days === 0) return "Trial ends today";
              if (days < 0) return "Trial ended";
              return `Trial ends on ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
            })()}
          </div>
        </div>
      )}

      {/* Footer with source and actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
          <span className="text-xs text-[#B3B3B3]">
            via {subscription.integrationSource}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(subscription)}
            className="text-[#3B82F6] hover:text-[#60A5FA] p-2 rounded-lg hover:bg-[#3B82F6]/10 transition-all duration-200"
            title="Edit Subscription"
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(subscription)}
            className="text-[#EF4444] hover:text-[#F87171] p-2 rounded-lg hover:bg-[#EF4444]/10 transition-all duration-200"
            title="Delete Subscription"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
