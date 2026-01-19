//Parse subscription-related data from email metadata
//Uses simple rule-based logic (as required by issue)

export const parseEmailForSubscription = (email) => {
  const subject = email.subject?.toLowerCase() || "";
  const sender = email.sender || "";

  // service name
  let serviceName = "Unknown";

  // Try extracting from sender email/domain
  const senderMatch = sender.match(/<([^>]+)>/);
  if (senderMatch) {
    const domain = senderMatch[1].split("@")[1];
    if (domain) {
      serviceName = domain.split(".")[0];
    }
  }

  // Fallback: infer from subject
  if (serviceName === "Unknown" && subject) {
    serviceName = subject.split(" ")[0];
  }

  // Billing hints
  let billingHint = null;

  if (subject.includes("monthly")) billingHint = "monthly";
  else if (subject.includes("renewal")) billingHint = "renewal";
  else if (subject.includes("charged")) billingHint = "charged";
  else if (subject.includes("payment")) billingHint = "payment";

  // Amount detection
  let amount = null;
  const amountMatch = subject.match(/₹\s?\d+(\.\d+)?/);
  if (amountMatch) {
    amount = amountMatch[0];
  }

  return {
    messageId: email.messageId,
    serviceName,
    billingHint,
    amount,
    timestamp: email.timestamp
  };
};
