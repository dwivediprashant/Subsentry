
const SubscriptionCategory = Object({
  STREAMING: "streaming",
  SOFTWARE: "software",
  UTILITIES: "utilities",
  EDUCATION: "education",
  FITNESS: "fitness",
  FINANCE: "finance",
  GAMING: "gaming",
  MUSIC: "music",
  NEWS: "news",
  CLOUD: "cloud",
  OTHER: "other",
});

const BillingCycle = Object({
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
  CUSTOM: "custom",
});

const SubscriptionStatus = Object({
  ACTIVE: "active",
  TRIAL: "trial",
  PAUSED: "paused",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
});

const GMAIL_SUBSCRIPTION_KEYWORDS = [
  "subscription",
  "renewal",
  "trial",
  "billing",
  "invoice",
  "payment",
  "receipt",
  "charged",
];

module.exports = {
  SubscriptionCategory,
  BillingCycle,
  SubscriptionStatus,
  GMAIL_SUBSCRIPTION_KEYWORDS,
};
