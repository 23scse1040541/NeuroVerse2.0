import express from 'express';
import { HfInference } from '@huggingface/inference';

const router = express.Router();
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// @route   POST /api/chatbot
// @desc    Get chatbot response from Hugging Face AI
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    const result = await hf.chatCompletion({
      model: 'meta-llama/Llama-3.2-1B-Instruct',
      messages: [
        {
          role: 'system',
          content: 'You are Neuroverse, a compassionate mental health wellness AI assistant. Respond with empathy, provide supportive guidance, and keep responses concise (1-2 sentences).'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const reply = result.choices[0]?.message?.content || "I'm here to support you. Would you like to talk about how you're feeling? 😊";

    res.status(200).json({
      success: true,
      reply: reply.trim(),
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    console.error('Error details:', error);
    res.status(200).json({
      success: true,
      reply: "I'm here to listen. Please tell me more about what's on your mind. Sometimes talking helps. 💙",
      timestamp: new Date()
    });
  }
});

export default router;