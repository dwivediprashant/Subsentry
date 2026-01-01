export const validateCreateSubscription = (data) => {
  const requiredFields = ["name", "price", "billingCycle", "renewalDate"];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `Missing required field: ${field}`;
    }
  }

  if (typeof data.price !== "number" || data.price < 0) {
    return "Price must be a non-negative number";
  }

  if (data.isTrial && !data.trialEndsAt) {
    return "trialEndsAt is required when isTrial is true";
  }

  return null;
};
