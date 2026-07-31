import express from 'express';
import Message from '../models/Message';

const router = express.Router();

router.get('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const messages = await Message.find({ appointmentId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

export default router;