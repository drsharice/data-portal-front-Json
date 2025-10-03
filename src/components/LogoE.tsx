// components/LogoE.tsx
import logoE from "../assets/logo-e.png";

export default function LogoE({ size = 180, color = "text-white" }: { size?: number; color?: string }) {
  return (
    <img
      src={logoE}
      alt="Data Edge Logo E"
      className={`${color}`}
      style={{ height: `${size}px`, width: "auto" }}
    />
  );
}
