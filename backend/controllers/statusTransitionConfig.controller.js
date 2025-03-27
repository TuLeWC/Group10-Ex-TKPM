import StatusTransitionConfig from '../models/StatusTransitionConfig.js';

export const getAllStatusTransitions = async (req, res) => {
  try {
    const transitions = await StatusTransitionConfig.find()
      .populate('fromStatus')
      .populate('toStatus');

    res.status(200).json(transitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStatusTransition = async (req, res) => {
  try {
    const { fromStatus, toStatus } = req.body;

    const existingTransition = await StatusTransitionConfig.findOne({
      fromStatus,
      toStatus,
    });

    if (existingTransition) {
      return res
        .status(400)
        .json({ message: 'Trạng thái chuyển đổi này đã tồn tại' });
    }

    const newTransition = new StatusTransitionConfig({ fromStatus, toStatus });
    await newTransition.save();

    res.status(201).json({
      message: 'Thêm trạng thái chuyển đổi thành công',
      newTransition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStatusTransition = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedTransition = await StatusTransitionConfig.findByIdAndDelete(
      id
    );

    if (!deletedTransition) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy trạng thái chuyển đổi cần xóa' });
    }

    res.status(200).json({
      message: 'Xóa trạng thái chuyển đổi thành công',
      deletedTransition,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
