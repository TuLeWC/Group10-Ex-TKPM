import EmailConfig from '../models/EmailConfig.js';

export const getAllEmailConfigs = async (req, res) => {
  try {
    const emailConfigs = await EmailConfig.find();

    res.status(200).json(emailConfigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addEmailConfig = async (req, res) => {
  try {
    const { domain } = req.body;

    const existingDomain = await EmailConfig.findOne({ domain });

    if (existingDomain) {
      return res.status(400).json({ message: 'Domain đã tồn tại' });
    }

    const newDomain = new EmailConfig({ domain });
    await newDomain.save();

    return res
      .status(201)
      .json({ message: 'Thêm domain thành công', newDomain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmailConfig = async (req, res) => {
  try {
    const id = req.params.id;

    const emailConfig = await EmailConfig.findByIdAndDelete(id);

    if (!emailConfig) {
      return res.status(404).json({ message: 'Không tìm thấy domain' });
    }

    return res
      .status(200)
      .json({ message: 'Xoá domain thành công', emailConfig });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
