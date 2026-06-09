/**
 * Ad placeholder slot. Renders nothing until ads are actually enabled
 * (NEXT_PUBLIC_ENABLE_ADS="true"), so no empty "Advertisement" box is shown to
 * users. The monetization skill flips the flag and drops AdSense/GPT in here.
 */
export function AdSlot({
  format = "leaderboard",
  className = "",
}: {
  format?: "leaderboard" | "rectangle" | "mobile";
  className?: string;
}) {
  if (process.env.NEXT_PUBLIC_ENABLE_ADS !== "true") return null;

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
