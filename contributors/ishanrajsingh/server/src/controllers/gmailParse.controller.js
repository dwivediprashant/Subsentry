import { parseEmailForSubscription } from "../utils/emailParser.util.js";
import { fetchTransactionalEmails } from "./gmailFetch.controller.js";

//Fetch + parse transactional emails into structured data
export const parseSubscriptionEmails = async (req, res) => {
  try {
    // Reuse existing fetch logic
    const fakeRes = {
      status: () => fakeRes,
      json: (data) => data
    };

    const data = await fetchTransactionalEmails(req, fakeRes);

    // If no emails
    if (!data || !data.emails || data.emails.length === 0) {
      return res.status(200).json({
        success: true,
        parsed: []
      });
    }

    // Parse emails
    const parsed = data.emails.map(parseEmailForSubscription);

    return res.status(200).json({
      success: true,
      count: parsed.length,
      parsed
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to parse subscription emails",
      message: error.message
    });
  }
};
