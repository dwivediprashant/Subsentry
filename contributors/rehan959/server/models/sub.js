import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    billingCycle: {
      type: String,
      required: [true, 'Billing cycle is required'],
      enum: {
        values: ['monthly', 'yearly', 'weekly'],
        message: '{VALUE} is not a supported billing cycle',
      },
      lowercase: true,
    },
    category: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'paused'],
      default: 'active',
      lowercase: true,
    },
    userClerkId: {
      type: String,
      required: [true, 'User ownership (Clerk ID) is required'],
      index: true,
    },
    source: {
      type: String,
      enum: ['manual', 'email'],
      default: 'manual',
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for common queries
subscriptionSchema.index({ userClerkId: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
