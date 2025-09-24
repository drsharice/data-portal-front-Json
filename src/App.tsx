import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Analytics from "./pages/Analytics";
import APIs from "./pages/APIs";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Data />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/apis" element={<APIs />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />

      </Routes>

      <ChatBot />
    </div>
  );
}
