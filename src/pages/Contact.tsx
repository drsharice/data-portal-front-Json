import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

export default function Contact() {
  useTitle("Contact | Data Portal");
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate submission
    alert("Thank you for the email, we will reach out to you shortly.");

    // Redirect to home
    navigate("/");
  };

  // Handle cancel (X button)
  const handleCancel = () => {
    setName("");
    setEmail("");
    setMessage("");
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[800px] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-6 md:p-10 relative">
        {/* X Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 left-4 text-gray-600 hover:text-red-600 text-xl font-bold"
          title="Close"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="mb-6 text-gray-700 text-center">
          Need help or have questions about the Data Portal? Reach out to our team below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-red-600"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
