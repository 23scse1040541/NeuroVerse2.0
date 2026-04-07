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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
            <MessageCircle className="w-8 h-8 mr-3 text-cyan-400" />
            AI Assistant
          </h1>
          <p className="text-white/60">Chat with your personal wellness companion</p>
        </motion.div>

        {/* Chat Box */}
        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden flex flex-col"
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
                        ? "bg-cyan-500"
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
                          ? "bg-cyan-500 text-white"
                          : "bg-white/10 text-white border border-white/20"
                      }`}>
                        {msg.text}
                      </div>

                      <p className="text-xs text-white/40 mt-1">
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
              <p className="text-white/50">AI is typing...</p>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-white/5 flex items-center space-x-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
            />

            <button
              onClick={sendMessage}
              className="p-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}