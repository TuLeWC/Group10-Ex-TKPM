import mongoose from 'mongoose';

const phoneConfigSchema = mongoose.Schema({
  country: { type: String, requried: true, unique: true },
  regexPattern: { type: String, required: true },
});

const PhoneConfig = mongoose.model('PhoneConfig', phoneConfigSchema);

export default PhoneConfig;
