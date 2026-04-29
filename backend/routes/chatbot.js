import express from 'express';
import { HfInference } from '@huggingface/inference';

const router = express.Router();

// Only initialize HuggingFace if token is available
const hfToken = process.env.HUGGINGFACE_TOKEN;
const hf = hfToken ? new HfInference(hfToken) : null;

if (hf) {
  console.log('✅ HuggingFace AI configured');
} else {
  console.warn('⚠️ HuggingFace token not available - using fallback responses');
}

// @route   POST /api/chatbot
// @desc    Get chatbot response from Hugging Face AI
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Check if HuggingFace is configured
    if (!hf) {
      console.warn('⚠️ HuggingFace not configured - returning fallback response');
      return res.status(200).json({
        success: true,
        reply: "I'm here to listen. Please tell me more about what's on your mind. Sometimes talking helps. 💙",
        timestamp: new Date(),
        fallback: true
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    let result;
    try {
      result = await hf.chatCompletion({
        model: "KevSun/mentalhealth_LM",
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
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      // Return fallback response on AI error
      return res.status(200).json({
        success: true,
        reply: "I appreciate you sharing that with me. Would you like to explore some coping strategies together? 🌟",
        timestamp: new Date(),
        fallback: true
      });
    }

    const reply = result?.choices?.[0]?.message?.content || "I'm here to support you. Would you like to talk about how you're feeling? 😊";

    res.status(200).json({
      success: true,
      reply: reply.trim(),
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    // Always return 200 with fallback to prevent frontend crashes
    res.status(200).json({
      success: true,
      reply: "I'm here to listen. Please tell me more about what's on your mind. Sometimes talking helps. 💙",
      timestamp: new Date(),
      fallback: true
    });
  }
});

export default router;