import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User } from "lucide-react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your Neuroverse AI. How can I help you today? 😊",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: "user",
      text: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      const botMessage = {
        type: "bot",
        text: data.reply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Error connecting to AI",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
            <MessageCircle className="w-10 h-10 mr-3" />
            Neuroverse AI
          </h1>
          <p className="text-gray-600">
            Chat with your AI assistant
          </p>
        </motion.div>

        {/* Chat Box */}
        <div
          className="card p-0 overflow-hidden flex flex-col mt-6"
          style={{ height: "500px" }}
        >

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.type === "user"
                        ? "bg-primary"
                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                    }`}>
                      {msg.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <div className={`px-4 py-2 rounded-xl ${
                        msg.type === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {msg.text}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading */}
            {loading && (
              <p className="text-gray-500">AI is typing...</p>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white flex items-center space-x-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg"
            />

            <button
              onClick={sendMessage}
              className="btn-primary px-4 py-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}