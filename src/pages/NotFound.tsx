import { useTitle } from "../hooks/useTitle";
export default function NotFound() {
  useTitle("404 Not Found | Data Portal");
  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-6 grid place-items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold">Page not found</h1>
    </section>
  );
}
