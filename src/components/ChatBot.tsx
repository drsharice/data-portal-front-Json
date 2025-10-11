import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logoEBlack from "../assets/logo-e-black.png";

interface ChatBotProps {
  isOpen?: boolean;          // controlled from Hero
  onClose?: () => void;      // controlled from Hero
  disableFloating?: boolean; // NEW: disables floating button on other pages
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen = false, onClose, disableFloating = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if ((isHomePage && isOpen) || (!isHomePage && open)) {
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

  const chatIsOpen = isHomePage ? isOpen : open;

  return (
    <div>
      {/* Floating Button only if NOT home and floating is allowed */}
      {!isHomePage && !chatIsOpen && !disableFloating && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg border border-black hover:bg-yellow-500 transition flex items-center gap-2"
        >
          <img src={logoEBlack} alt="Dedge Icon" className="w-5 h-5" />
          Chat with Dedge
        </button>
      )}

      {chatIsOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col">
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

          <div className="flex-1 p-3 overflow-y-auto max-h-64">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
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

          <div className="p-2 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border rounded px-2 py-1 mr-2 text-black"
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
