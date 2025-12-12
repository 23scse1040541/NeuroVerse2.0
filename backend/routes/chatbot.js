import express from 'express';

const router = express.Router();

// Simple chatbot responses
const chatbotResponses = {
  greetings: [
    "Hello! I'm here to support you. How are you feeling today?",
    "Hi there! Welcome to Neuro Verse. How can I help you today?",
    "Hey! I'm your mental wellness companion. What's on your mind?"
  ],
  mood: {
    happy: "That's wonderful! Keep up the positive energy. Would you like to journal about what made you happy?",
    sad: "I'm sorry you're feeling down. Remember, it's okay to feel this way. Have you tried meditation or talking to someone?",
    anxious: "Take a deep breath. You're safe. Try our breathing exercises or listen to calming music.",
    stressed: "Stress is tough. How about a quick 5-minute meditation? Or write in your journal to release those feelings.",
    calm: "That's great! Maintaining calmness is important. Keep practicing mindfulness.",
    angry: "It's okay to feel angry. Try some deep breathing or go for a walk. Would you like some calming techniques?",
    tired: "Rest is important for mental health. Make sure you're getting enough sleep and taking breaks."
  },
  meditation: [
    "Meditation is great for mental clarity. Try our 10-minute guided meditation in the Mindfulness section.",
    "Regular meditation can reduce stress and anxiety. Start with just 5 minutes a day!",
    "Find a quiet space, close your eyes, and focus on your breathing. Let's meditate together!"
  ],
  support: [
    "You're not alone. If you need professional help, check out our Connect section to talk with specialists.",
    "Remember: You are stronger than you think. Take one step at a time.",
    "Your mental health matters. Don't hesitate to reach out to friends, family, or professionals."
  ],
  motivation: [
    "Every day is a new opportunity for growth and healing.",
    "You've overcome challenges before, and you can do it again. Keep going!",
    "Small steps every day lead to big changes. Be proud of your progress!",
    "Your feelings are valid, and it's okay to ask for help.",
    "Believe in yourself. You're doing better than you think!"
  ],
  breathing: [
    "Let's try the 4-7-8 breathing technique: Breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 3 times.",
    "Box breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4. This helps calm your nervous system.",
    "Deep belly breathing: Place your hand on your stomach, breathe deeply so your belly rises. Exhale slowly."
  ],
  journaling: [
    "Writing down your thoughts can be very therapeutic. Head to the Journal section to start!",
    "Journaling helps process emotions. Try writing about: What made you smile today? What challenged you?",
    "Your journal is a safe space. Write freely without judgment."
  ],
  default: [
    "I'm here to help. You can ask me about meditation, breathing exercises, mood tracking, or connecting with specialists.",
    "Tell me more about how you're feeling, or ask me for tips on mindfulness and self-care.",
    "I can help with: 😊 Mood check-ins, 📝 Journaling tips, 🧘 Meditation guidance, 💚 Support resources"
  ]
};

// @route   POST /api/chatbot
// @desc    Get chatbot response
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

    const userMessage = message.toLowerCase();
    let response;

    // Detect intent
    if (userMessage.match(/hello|hi|hey|good morning|good evening/)) {
      response = chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)];
    } else if (userMessage.match(/happy|great|good|amazing|wonderful/)) {
      response = chatbotResponses.mood.happy;
    } else if (userMessage.match(/sad|down|depressed|low|unhappy/)) {
      response = chatbotResponses.mood.sad;
    } else if (userMessage.match(/anxious|anxiety|worried|nervous|panic/)) {
      response = chatbotResponses.mood.anxious;
    } else if (userMessage.match(/stressed|stress|overwhelmed|pressure/)) {
      response = chatbotResponses.mood.stressed;
    } else if (userMessage.match(/calm|peaceful|relaxed|serene/)) {
      response = chatbotResponses.mood.calm;
    } else if (userMessage.match(/angry|mad|frustrated|irritated/)) {
      response = chatbotResponses.mood.angry;
    } else if (userMessage.match(/tired|exhausted|fatigue|sleepy/)) {
      response = chatbotResponses.mood.tired;
    } else if (userMessage.match(/meditat|mindful|zen|peace/)) {
      response = chatbotResponses.meditation[Math.floor(Math.random() * chatbotResponses.meditation.length)];
    } else if (userMessage.match(/breath|breathing|inhale|exhale/)) {
      response = chatbotResponses.breathing[Math.floor(Math.random() * chatbotResponses.breathing.length)];
    } else if (userMessage.match(/journal|write|diary|note/)) {
      response = chatbotResponses.journaling[Math.floor(Math.random() * chatbotResponses.journaling.length)];
    } else if (userMessage.match(/help|support|talk|specialist|therapist/)) {
      response = chatbotResponses.support[Math.floor(Math.random() * chatbotResponses.support.length)];
    } else if (userMessage.match(/motivat|inspire|encourage|strength/)) {
      response = chatbotResponses.motivation[Math.floor(Math.random() * chatbotResponses.motivation.length)];
    } else {
      response = chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
    }

    res.status(200).json({
      success: true,
      response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing chatbot request',
      error: error.message
    });
  }
});

export default router;
