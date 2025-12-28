import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    // Ownership:who thiss Subscription belongs to...
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Human-readable subscription name (e.g., Netflix,Spotify, Facebook, etcc..)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Billing details
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "weekly", "custom"],
      lowercase: true,
    },

    // Renewal tracking
    renewalDate: {
      type: Date,
      required: true,
    },

    // Trial support
    isTrial: {
      type: Boolean,
      default: false,
    },
    trialEndsAt: {
      type: Date,
    },

    // Source of subscription data
    source: {
      type: String,
      default: "manual",
      lowercase: true,
    },

    // Logical status (kept minimal)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
