export default function ValueProp() {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-brand-black">
      <div className="mx-auto w-[92vw] max-w-6xl">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-60" />
          <div className="p-8 md:p-14">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Smarter Access to Smarter Data
            </h2>
            <p className="mt-6 text-lg md:text-2xl leading-relaxed text-white/80 max-w-4xl">
              We&apos;re changing the way data flows—giving clients visibility into
              what&apos;s available in our space. With our intuitive data portal, you can
              browse datasets, understand what&apos;s offered, and request access with
              precision. It&apos;s data delivery, reimagined for clarity and control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}