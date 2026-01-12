import mongoose from "mongoose";
import { categoryValues, sourceValues, statusValues } from "../constants/subscription.js";
import { billingCycle } from "../constants/billing.js";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    billingCycle: {
        type: String,
        enum: billingCycle,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
      type: String,
      enum: categoryValues,
      default: "Other",
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    isTrial: {
      type: Boolean,
      default: false,
    },
    trialEndDate: {
      type: Date,
    },
    source: {
      type: String,
      enum: sourceValues,
      default: "manual",
    },
    status: {
      type: String,
      enum: statusValues,
      default: "active",
    },
},{
    timestamps: true,
}
)

export default mongoose.model("Subscription", subscriptionSchema);