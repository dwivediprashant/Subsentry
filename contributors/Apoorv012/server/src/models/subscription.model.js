import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true
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

    renewalDate: {
      type: Date,
      required: true,
    },

    isTrial: {
      type: Boolean,
      default: false,
    },

    trialEndsAt: {
      type: Date,
    },

    source: {
      type: String,
      enum: ["manual", "gmail", "other"],
      default: "manual",
    },
  },
  { timestamps: true }
);


subscriptionSchema.index({ userId: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;