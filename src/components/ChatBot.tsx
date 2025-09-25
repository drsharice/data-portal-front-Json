import React, { useState } from "react";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: "👋 Hi, I’m your Portal Helper. I can help you find datasets, APIs, and Reports." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);

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

    setInput("");
  };

  return (
    <div>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg border border-black hover:bg-yellow-500 transition"
        >
          💬 Can I help you?
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-5 right-5 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col transform transition-transform duration-300 ease-out animate-slideUp"
        >
          {/* Header */}
          <div className="bg-yellow-400 text-black font-semibold p-3 rounded-t-lg flex justify-between items-center border-b border-black">
            <span>Portal Helper (Beta)</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-64">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
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
              className="flex-1 border rounded px-2 py-1 mr-2"
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
