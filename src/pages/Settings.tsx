import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

export default function Settings() {
  useTitle("Settings | Data Portal");
  const navigate = useNavigate();

  const [backgroundChoice, setBackgroundChoice] = useState(
    localStorage.getItem("dataBackgroundColor") || "gray"
  );

  const handleCancel = () => navigate("/");

  const handleSave = () => {
    localStorage.setItem("dataBackgroundColor", backgroundChoice);
    window.dispatchEvent(new Event("storage"));
    alert("Settings saved!");
    navigate("/data");
  };

  const handleChange = (value: string) => {
    setBackgroundChoice(value);
    localStorage.setItem("dataBackgroundColor", value);
    window.dispatchEvent(new Event("storage"));
  };

  // Define preview styles for flat brand wallpapers
  const getPreviewStyle = () => {
    switch (backgroundChoice) {
      case "diagonal":
        return { background: "linear-gradient(135deg, #ef4444 0%, #facc15 100%)" };
      case "focus":
        return { background: "radial-gradient(circle at center, #000000 0%, #ef4444 100%)" };
      case "fusion":
        return { background: "linear-gradient(90deg, #facc15, #ef4444, #000000)" };
      case "stripe":
        return {
          backgroundImage:
            "repeating-linear-gradient(45deg, #ef4444, #ef4444 20px, #facc15 20px, #facc15 40px, #000000 40px, #000000 60px)",
        };
      default:
        return { backgroundColor: backgroundChoice };
    }
  };

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8 relative">
      <div className="mx-auto w-full max-w-[800px] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-6 md:p-10 relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 left-4 text-gray-600 hover:text-red-600 text-xl font-bold"
          title="Close"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold mb-4 text-center">Settings</h1>
        <p className="mb-6 text-gray-700 text-center">
          Customize your Data Portal background.
        </p>

        <div className="space-y-6">
          {/* Background Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Background Style (Data Page)
            </label>
            <select
              value={backgroundChoice}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-red-600"
            >
              <optgroup label="Solid Colors">
                <option value="gray">Gray</option>
                <option value="white">White</option>
                <option value="lightyellow">Light Yellow</option>
                <option value="lightblue">Light Blue</option>
                <option value="lightgreen">Light Green</option>
              </optgroup>
              <optgroup label="Brand Wallpapers">
                <option value="diagonal">Diagonal Energy (Red → Yellow)</option>
                <option value="focus">Focus Glow (Black → Red)</option>
                <option value="fusion">Edge Fusion (Yellow → Red → Black)</option>
                <option value="stripe">Subtle Stripe (Pattern)</option>
              </optgroup>
            </select>
          </div>

          {/* Live Preview */}
          <div
            className="rounded-xl h-40 mt-6 shadow-inner border border-gray-300 transition-all duration-500"
            style={getPreviewStyle()}
          ></div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={handleCancel}
              className="rounded-lg bg-gray-400 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
