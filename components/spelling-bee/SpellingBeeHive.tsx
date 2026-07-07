/**
 * The seven-letter honeycomb — the signature visual of the page.
 * Center letter is filled honey-gold; the six outer letters are outlined combs.
 * Pure SVG so it scales crisply and animates in with a staggered reveal.
 */

interface SpellingBeeHiveProps {
  centerLetter: string;
  outerLetters: string[];
  className?: string;
}

// Flat-top hexagon path on a 100x100 viewBox cell.
const HEX = "M25 6 L75 6 L100 50 L75 94 L25 94 L0 50 Z";

// Positions for the 6 outer combs around a center comb, on a shared canvas.
// Coordinates are the top-left of each 100-unit hex cell in a 300x300 field.
const OUTER_POS = [
  { x: 100, y: 4 }, // top
  { x: 196, y: 54 }, // top-right
  { x: 196, y: 154 }, // bottom-right
  { x: 100, y: 204 }, // bottom
  { x: 4, y: 154 }, // bottom-left
  { x: 4, y: 54 }, // top-left
];
const CENTER_POS = { x: 100, y: 104 };

function Comb({
  x,
  y,
  letter,
  center,
  delayMs,
}: {
  x: number;
  y: number;
  letter: string;
  center?: boolean;
  delayMs: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      className="animate-fade-in-up motion-reduce:animate-none"
      style={{ animationDuration: "0.5s", animationDelay: `${delayMs}ms`, animationFillMode: "both" }}
    >
      <path
        d={HEX}
        className={
          center
            ? "fill-[hsl(var(--cta))] stroke-[hsl(var(--cta))]"
            : "fill-card stroke-border"
        }
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <text
        x={50}
        y={52}
        textAnchor="middle"
        dominantBaseline="central"
        className={
          center
            ? "fill-[hsl(var(--cta-foreground))] font-heading font-bold"
            : "fill-foreground font-heading font-bold"
        }
        style={{ fontSize: "40px" }}
      >
        {letter.toUpperCase()}
      </text>
    </g>
  );
}

export default function SpellingBeeHive({
  centerLetter,
  outerLetters,
  className,
}: SpellingBeeHiveProps) {
  return (
    <svg
      viewBox="0 0 300 308"
      className={className ?? "mx-auto h-56 w-56 sm:h-64 sm:w-64"}
      role="img"
      aria-label={`Today's Spelling Bee letters: center letter ${centerLetter.toUpperCase()}, outer letters ${outerLetters
        .map((l) => l.toUpperCase())
        .join(", ")}`}
    >
      {OUTER_POS.map((pos, i) => (
        <Comb
          key={i}
          x={pos.x}
          y={pos.y}
          letter={outerLetters[i] ?? ""}
          delayMs={120 + i * 70}
        />
      ))}
      <Comb x={CENTER_POS.x} y={CENTER_POS.y} letter={centerLetter} center delayMs={0} />
    </svg>
  );
}
