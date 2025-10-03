import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logoEBlack from "../assets/logo-e-black.png";

interface ChatBotProps {
  isOpen?: boolean;          // used when controlled from Hero
  onClose?: () => void;      // used when controlled from Hero
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // local state (for floating button on other pages)
  const [open, setOpen] = useState(false);

  // messages
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if ((isHomePage && isOpen) || (!isHomePage && open)) {
      // show greeting once when chat opens
      setMessages([
        { sender: "bot", text: "👋 Hi, I’m Dedge. I can help you explore datasets, APIs, and reports." }
      ]);
    }
  }, [isOpen, open, isHomePage]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // simple responses
    let response = "🤖 Sorry, I don’t have an answer for that yet.";
    if (input.toLowerCase().includes("dataset")) {
      response = "✅ You can explore datasets in the Catalog page.";
    } else if (input.toLowerCase().includes("api")) {
      response = "🔗 APIs are available under the API page.";
    } else if (input.toLowerCase().includes("help")) {
      response = "Here’s what I can do:\n- Show datasets 📊\n- Point to APIs 🔗\n- Answer FAQs ❓";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: response }]);
    }, 500);
  };

  // decide if chat is open
  const chatIsOpen = isHomePage ? isOpen : open;

  return (
    <div>
      {/* Floating Button only if NOT home */}
      {!isHomePage && !chatIsOpen && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg border border-black hover:bg-yellow-500 transition flex items-center gap-2"
        >
          <img src={logoEBlack} alt="Dedge Icon" className="w-5 h-5" />
          Chat with Dedge
        </button>
      )}

      {/* Chat Window */}
      {chatIsOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col">
          {/* Header */}
          <div className="bg-yellow-400 text-black font-semibold p-3 rounded-t-lg flex justify-between items-center border-b border-black">
            <div className="flex items-center gap-2">
              <img src={logoEBlack} alt="Dedge Icon" className="w-5 h-5" />
              <span>Dedge</span>
            </div>
            <button
              onClick={() => (isHomePage ? onClose && onClose() : setOpen(false))}
              className="text-black font-bold"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-64">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border rounded px-2 py-1 mr-2 text-black"  // 👈 ensure visible black text
            />
            <button
              onClick={handleSend}
              className="bg-yellow-400 text-black font-semibold px-3 py-1 rounded border border-black hover:bg-yellow-500 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
