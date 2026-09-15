const mongoose = require("mongoose");

const SellCropSchema = new mongoose.Schema(
  {
    lotId: {
      type: String,
      unique: true,
      index: true,
      default: () => `LOT-${Date.now().toString().slice(-6)}`,
    },
    farmerId: {
      type: String,
      default: "FMR-01",
      index: true,
    },
    farmerName: {
      type: String,
      required: [true, "Farmer name is required"],
      trim: true,
    },
    farmerPhone: {
      type: String,
      required: [true, "Farmer phone number is required"],
      trim: true,
    },
    farmerEmail: {
      type: String,
      trim: true,
      default: "",
    },
    crop: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      index: true,
    },
    variety: {
      type: String,
      default: "Standard Variety",
      trim: true,
    },
    grade: {
      type: String,
      enum: ["Grade A", "Grade B", "FAQ", "Export Quality", "Organic Certified"],
      default: "Grade A",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1 Quintal"],
    },
    unit: {
      type: String,
      default: "Quintals",
    },
    askingPrice: {
      type: Number,
      required: [true, "Asking price per quintal is required"],
      min: [50, "Price per quintal must be realistic"],
    },
    totalValuation: {
      type: Number,
      default: function () {
        return (this.quantity || 0) * (this.askingPrice || 0);
      },
    },
    harvestStatus: {
      type: String,
      default: "Harvested • Ready for Pickup",
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      index: true,
    },
    farmAddress: {
      type: String,
      default: "Local Farm Gate",
    },
    location: {
      type: String,
      default: function () {
        return `${this.district || "Mandi"}, ${this.state || "State"}`;
      },
    },
    notes: {
      type: String,
      default: "Direct sun-dried farm harvest. Checked moisture under 12%.",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=70",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    status: {
      type: String,
      enum: ["Available", "Under Negotiation", "Sold", "Archived"],
      default: "Available",
      index: true,
    },
    bidsCount: {
      type: Number,
      default: 0,
    },
    activeBids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
  },
  {
    timestamps: true,
  }
);

SellCropSchema.pre("save", function (next) {
  if (this.isModified("quantity") || this.isModified("askingPrice")) {
    this.totalValuation = (this.quantity || 0) * (this.askingPrice || 0);
  }
  if (this.quantity <= 0) {
    this.status = "Sold";
  }
  next();
});

module.exports = mongoose.model("SellCrop", SellCropSchema);
