const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    bidId: {
      type: String,
      unique: true,
      index: true,
      default: () => `BID-${Date.now().toString().slice(-6)}`,
    },
    cropId: {
      type: String,
      required: [true, "Associated crop listing ID is required"],
      index: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    variety: {
      type: String,
      default: "Standard Variety",
    },
    farmerId: {
      type: String,
      required: true,
      index: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerPhone: {
      type: String,
      required: true,
    },
    dealerId: {
      type: String,
      default: "DLR-01",
      index: true,
    },
    dealerName: {
      type: String,
      required: [true, "Dealer name is required"],
      trim: true,
    },
    dealerPhone: {
      type: String,
      required: [true, "Dealer contact phone is required"],
      trim: true,
    },
    dealerEmail: {
      type: String,
      default: "",
    },
    originalAskingPrice: {
      type: Number,
      required: true,
    },
    bidPrice: {
      type: Number,
      required: [true, "Bid price per quintal is required"],
      min: [100, "Bid price must be a valid wholesale rate"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity to purchase is required"],
      min: [1, "Quantity must be at least 1 Quintal"],
    },
    totalAmount: {
      type: Number,
      default: function () {
        return (this.bidPrice || 0) * (this.quantity || 0);
      },
    },
    pickupDate: {
      type: String,
      required: [true, "Proposed pickup date is required"],
    },
    logistics: {
      type: String,
      default: "Dealer Self-Pickup (Farm Gate)",
    },
    note: {
      type: String,
      default: "Ready for digital farm gate settlement upon weighbridge slip verification.",
    },
    // CRITICAL WORKFLOW STATUS:
    // Only when status === 'Approved', the dealer can proceed to purchase at this bid rate!
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Purchased"],
      default: "Pending",
      index: true,
    },
    farmerResponseDate: {
      type: Date,
    },
    farmerRemarks: {
      type: String,
      default: "",
    },
    purchaseId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

BidSchema.pre("save", function (next) {
  if (this.isModified("bidPrice") || this.isModified("quantity")) {
    this.totalAmount = (this.bidPrice || 0) * (this.quantity || 0);
  }
  next();
});

module.exports = mongoose.model("Bid", BidSchema);
