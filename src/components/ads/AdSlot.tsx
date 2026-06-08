/**
 * Reserved, fixed-size ad placeholder. Renders nothing visually intrusive now;
 * the monetization skill wires AdSense/GPT into these later. Fixed dimensions
 * keep layout shift (CLS) at zero.
 */
export function AdSlot({
  format = "leaderboard",
  className = "",
}: {
  format?: "leaderboard" | "rectangle" | "mobile";
  className?: string;
}) {
  const size =
    format === "rectangle"
      ? "h-[250px] w-[300px]"
      : format === "mobile"
        ? "h-[100px] w-full max-w-[320px]"
        : "h-[90px] w-full max-w-[728px]";

  return (
    <div
      data-ad-slot={format}
      aria-hidden
      className={`mx-auto flex ${size} items-center justify-center rounded-lg border border-dashed border-white/10 text-[10px] uppercase tracking-widest text-white/20 ${className}`}
    >
      Advertisement
    </div>
  );
}
