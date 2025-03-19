const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  houseNumber: { type: String, required: true },
  street: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model("Address", AddressSchema);
