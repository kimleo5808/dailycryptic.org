/**
 * The Letter Boxed square: three letter nodes on each of the four sides. When
 * `solution` is supplied and `showPath` is true, the word chain is traced over
 * the box as an animated line. Pure SVG, safe to render on the client.
 */

const VB = 300;
const P = 34; // padding inside the viewBox
const B = VB - P * 2; // box side length
const FRACS = [0.18, 0.5, 0.82];

type Pos = { x: number; y: number };

/** Map every letter to its node position from the four sides. */
function buildPositions(sides: string[]): Record<string, Pos> {
  const pos: Record<string, Pos> = {};
  const place = (letters: string, at: (f: number) => Pos) => {
    letters.split("").forEach((ch, i) => {
      pos[ch.toUpperCase()] = at(FRACS[i] ?? 0.5);
    });
  };
  // side 0 top, 1 right, 2 bottom, 3 left
  place(sides[0] ?? "", (f) => ({ x: P + B * f, y: P }));
  place(sides[1] ?? "", (f) => ({ x: P + B, y: P + B * f }));
  place(sides[2] ?? "", (f) => ({ x: P + B * f, y: P + B }));
  place(sides[3] ?? "", (f) => ({ x: P, y: P + B * f }));
  return pos;
}

/** Flatten the solution words into one continuous node sequence. */
function solutionPathLetters(solution: string[]): string[] {
  const seq: string[] = [];
  solution.forEach((word, i) => {
    const letters = word.toUpperCase().split("");
    // Consecutive words share the pivot letter, so skip the first letter
    // of every word after the first.
    seq.push(...(i === 0 ? letters : letters.slice(1)));
  });
  return seq;
}

export default function LetterBoxedBox({
  sides,
  solution,
  showPath = false,
  className,
}: {
  sides: string[];
  solution?: string[];
  showPath?: boolean;
  className?: string;
}) {
  const pos = buildPositions(sides);
  const nodes = Object.entries(pos);

  const pathPoints =
    showPath && solution
      ? solutionPathLetters(solution)
          .map((ch) => pos[ch])
          .filter(Boolean)
      : [];
  const pointsAttr = pathPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className={className ?? "mx-auto h-64 w-64 sm:h-72 sm:w-72"}
      role="img"
      aria-label={`Letter Boxed square with sides ${sides.join(", ")}`}
    >
      <style>{`
        @keyframes lb-draw { to { stroke-dashoffset: 0; } }
        .lb-path { animation: lb-draw 0.9s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .lb-path { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Box outline */}
      <rect
        x={P}
        y={P}
        width={B}
        height={B}
        rx={10}
        fill="none"
        className="stroke-border"
        strokeWidth={2}
      />

      {/* Solution path */}
      {pathPoints.length > 1 && (
        <polyline
          className="lb-path"
          points={pointsAttr}
          fill="none"
          stroke="hsl(var(--strands-hint))"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      )}

      {/* Letter nodes */}
      {nodes.map(([letter, p], i) => {
        const active = showPath && pathPoints.some((pp) => pp.x === p.x && pp.y === p.y);
        return (
          <g
            key={letter}
            className="animate-fade-in-up motion-reduce:animate-none"
            style={{ animationDuration: "0.4s", animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={16}
              className={active ? "fill-card" : "fill-card"}
              stroke={active ? "hsl(var(--strands-hint))" : "hsl(var(--border))"}
              strokeWidth={active ? 3 : 2}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground font-heading font-bold"
              style={{ fontSize: "18px" }}
            >
              {letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
