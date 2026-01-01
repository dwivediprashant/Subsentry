const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk user ID
      required: true,
      index: true,
    },

    name: {
      type: String, //platforms
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "trial", "cancelled", "expired"],
      default: "active",
    },

    isTrial: {
      type: Boolean,
      default: false,
    },

    trialEndsAt: {
      type: Date,
    },

    renewalDate: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      enum: ["manual", "gmail", "stripe", "razorpay"],
      required: true,
    },

    externalId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
