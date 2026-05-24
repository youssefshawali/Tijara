"use client";

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-hero-glow opacity-60" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-tijara-green/5 to-transparent opacity-40" />
      <div
        className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full opacity-20 animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(27, 142, 78, 0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
