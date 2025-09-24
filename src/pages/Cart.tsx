import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    cart.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "No description available",
      lob: "",
      justification: "",
    }))
  );

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    id: string,
    field: "lob" | "justification",
    value: string
  ) => {
    setFormData((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const removeItem = (id: string) => {
    const updated = formData.filter((f) => f.id !== id);
    setFormData(updated);
    if (updated.length === 0) {
      clearCart();
      navigate("/");
    }
  };

  const clearAll = () => {
    clearCart();
    setFormData([]);
    navigate("/");
  };

  const isValid =
    formData.length > 0 &&
    formData.every((f) => f.lob && f.justification.trim().length > 0);

  const handleSubmit = () => {
    console.log("Submitting request:", formData);
    clearCart();
    setSubmitted(true);

    setTimeout(() => navigate("/"), 2000);
  };

  if (submitted) {
    return (
      <section className="pt-24 px-4 md:px-8 flex justify-center items-center min-h-screen">
        <div className="max-w-lg mx-auto bg-white text-black rounded-2xl shadow-2xl p-8 text-center space-y-4">
          <div className="text-green-600 text-5xl">✔</div>
          <h1 className="text-2xl font-bold">Thank you!</h1>
          <p>
            Thank you for the data request, someone will reach out to you
            shortly.
          </p>
        </div>
      </section>
    );
  }

  if (formData.length === 0) {
    return (
      <section className="pt-24 px-4 md:px-8 text-center">
        <p className="text-lg">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1000px] bg-white text-black rounded-2xl shadow-2xl ring-1 ring-gray-200 p-6 space-y-6 relative">
        {/* Exit button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-600"
          title="Close without submitting"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold">Data Request Form</h1>

        <div className="space-y-4">
          {formData.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 relative space-y-3"
            >
              {/* Dataset name + description */}
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">
                  {item.description || "No description available"}
                </p>
              </div>

              {/* LOB Dropdown */}
              <select
                value={item.lob}
                onChange={(e) => handleChange(item.id, "lob", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Line of Business</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>

              {/* Justification */}
              <textarea
                value={item.justification}
                onChange={(e) =>
                  handleChange(item.id, "justification", e.target.value)
                }
                placeholder="Business justification..."
                rows={2}
                className="w-full border rounded px-3 py-2"
              />

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                title="Remove this dataset"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          {isValid && (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700"
              title="Submit your request"
            >
              Submit Request
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex-1 bg-gray-200 text-black font-semibold py-2 rounded-lg hover:bg-gray-300"
            title="Clear all datasets from cart"
          >
            Clear All
          </button>
        </div>
      </div>
    </section>
  );
}
