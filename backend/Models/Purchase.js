const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
      default: () => `PO-2026-${Date.now().toString().slice(-6)}`,
    },
    cropId: {
      type: String,
      required: [true, "Crop ID is required"],
      index: true,
    },
    bidId: {
      type: String,
      default: null,
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
      required: true,
      index: true,
    },
    dealerName: {
      type: String,
      required: true,
    },
    dealerPhone: {
      type: String,
      required: true,
    },
    // The rate approved by the farmer or agreed contract rate:
    finalRatePerQuintal: {
      type: Number,
      required: [true, "Final agreed rate per quintal is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity purchased is required"],
    },
    grossAmount: {
      type: Number,
      required: true,
    },
    mandiCess: {
      type: Number,
      default: 0,
    },
    netPayable: {
      type: Number,
      required: true,
    },
    pickupDate: {
      type: String,
      required: true,
    },
    logisticsProvider: {
      type: String,
      default: "Dealer Self-Pickup",
    },
    vehicleNumber: {
      type: String,
      default: () => "DL-01-AG-" + Math.floor(1000 + Math.random() * 9000),
    },
    paymentMode: {
      type: String,
      enum: [
        "Instant RTGS / Escrow Mandi Transfer",
        "Weighbridge Clearance Check",
        "Direct UPI Mandate",
        "Digital Mandi Wallet",
      ],
      default: "Instant RTGS / Escrow Mandi Transfer",
    },
    paymentStatus: {
      type: String,
      enum: ["Escrow Held", "Settlement Pending", "Paid", "Completed"],
      default: "Completed",
    },
    deliveryStatus: {
      type: String,
      enum: ["Scheduled", "In Transit", "Delivered", "Completed"],
      default: "In Transit",
    },
    farmLocation: {
      type: String,
      default: "Farm Gate Mandi Yard",
    },
    invoiceNumber: {
      type: String,
      default: () => `INV-APMC-${Date.now().toString().slice(-6)}`,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
