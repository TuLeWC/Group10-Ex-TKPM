import PhoneConfig from '../models/PhoneConfig.js';

// /api/phone-configs

export const getAllPhoneConfigs = async (req, res) => {
  try {
    const configs = await PhoneConfig.find();
    res.status(200).json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPhoneConfig = async (req, res) => {
  try {
    const { country, regexPattern } = req.body;

    const existingConfig = await PhoneConfig.findOne({ country });

    if (existingConfig) {
      return res
        .status(400)
        .json({ message: `Cấu hình cho ${country} đã tồn tại` });
    }

    const newConfig = new PhoneConfig({ country, regexPattern });
    await newConfig.save();

    res.status(201).json({ message: 'Thêm cấu hình thành công', newConfig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePhoneConfig = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedConfig = await PhoneConfig.findByIdAndDelete(id);

    if (!deletedConfig) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy cấu hình cần xoá' });
    }

    res.status(200).json({ message: 'Xoá cấu hình thành công', deletedConfig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
