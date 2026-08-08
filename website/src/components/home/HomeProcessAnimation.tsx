import type { ReactNode } from "react";
import "./home-process-animation.css";

type HomeProcessAnimationProps = {
  className?: string;
};

function ProcessNode({
  cx,
  cy,
  className,
  children,
  r = 18,
}: {
  cx: number;
  cy: number;
  className: string;
  children: ReactNode;
  r?: number;
}) {
  return (
    <g className={`hp-node ${className}`}>
      <circle className="hp-node-glow" cx={cx} cy={cy} r={r + 6} />
      <circle className="hp-node-ring" cx={cx} cy={cy} r={r} />
      <g className="hp-node-icon" transform={`translate(${cx}, ${cy})`}>
        {children}
      </g>
    </g>
  );
}

export function HomeProcessAnimation({ className = "" }: HomeProcessAnimationProps) {
  return (
    <div className={`home-process-anim pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 720 780"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hp-moon-grad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f7f7f4" />
            <stop offset="55%" stopColor="#d9dcd8" />
            <stop offset="100%" stopColor="#b7bbb4" />
          </radialGradient>
          <linearGradient id="hp-flame-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe566" />
            <stop offset="45%" stopColor="#ff9a1f" />
            <stop offset="100%" stopColor="#ff4d00" />
          </linearGradient>
          <linearGradient id="hp-sky-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="720" height="780" fill="url(#hp-sky-fade)" />

        <g className="hp-grid">
          <path
            className="hp-grid-line"
            d="M120 78 C120 140, 120 180, 160 220 C210 270, 250 300, 300 340"
          />
          <path
            className="hp-grid-line"
            d="M220 70 C220 130, 200 170, 200 230 C200 290, 260 320, 300 360"
          />
          <path
            className="hp-grid-line"
            d="M320 62 C320 120, 300 180, 300 250 C300 300, 300 330, 300 380"
          />
          <path
            className="hp-grid-line"
            d="M430 78 C430 140, 400 200, 360 260 C330 300, 310 340, 300 390"
          />
          <path
            className="hp-grid-line"
            d="M540 88 C520 150, 470 220, 400 280 C350 320, 320 360, 300 400"
          />

          <path className="hp-grid-line" d="M150 250 H250 M150 268 H250 M150 286 H250" />
          <path className="hp-grid-line" d="M150 250 V286 M250 250 V286" />
          <path className="hp-grid-line" d="M380 240 H500 M380 258 H500 M380 276 H500" />
          <path className="hp-grid-line" d="M380 240 V276 M500 240 V276" />

          <path className="hp-grid-line" d="M300 400 V460" />
          <path className="hp-grid-line" d="M220 460 H380" />
          <path className="hp-grid-line" d="M220 460 V500 M300 460 V500 M380 460 V500" />
          <path className="hp-grid-line" d="M300 500 V545" />
          <path className="hp-grid-line" d="M300 585 C320 610, 360 630, 400 545" />
        </g>

        <path
          className="hp-current-soft hp-current-a"
          d="M120 78 C120 140, 120 180, 160 220 C210 270, 250 300, 300 340 C300 380, 300 430, 300 545"
        />
        <path
          className="hp-current-soft hp-current-b"
          d="M320 62 C320 120, 300 180, 300 250 C300 320, 300 400, 300 545"
        />
        <path
          className="hp-current-soft hp-current-c"
          d="M430 78 C430 140, 400 200, 360 260 C330 300, 310 360, 300 420 C300 470, 300 510, 300 545"
        />
        <path
          className="hp-current-soft hp-current-d"
          d="M540 88 C520 150, 470 220, 400 280 C350 330, 320 390, 300 460 C300 500, 300 525, 300 545"
        />
        <path
          className="hp-current hp-current-a"
          d="M120 78 C120 140, 120 180, 160 220 C210 270, 250 300, 300 340 C300 380, 300 430, 300 545"
        />
        <path
          className="hp-current hp-current-b"
          d="M320 62 C320 120, 300 180, 300 250 C300 320, 300 400, 300 545"
        />
        <path
          className="hp-current hp-current-c"
          d="M430 78 C430 140, 400 200, 360 260 C330 300, 310 360, 300 420 C300 470, 300 510, 300 545"
        />
        <path
          className="hp-current hp-current-d"
          d="M540 88 C520 150, 470 220, 400 280 C350 330, 320 390, 300 460 C300 500, 300 525, 300 545"
        />

        <circle className="hp-spark hp-spark-a" cx="200" cy="230" r="3.5" />
        <circle className="hp-spark hp-spark-b" cx="360" cy="260" r="3.5" />
        <circle className="hp-spark hp-spark-c" cx="300" cy="400" r="3.5" />

        <ProcessNode cx={120} cy={78} className="hp-n1">
          <circle cy={-6} r={4.5} />
          <path d="M-8 4 C-8 -1, 8 -1, 8 4 V8 H-8 Z" />
        </ProcessNode>

        <ProcessNode cx={220} cy={70} className="hp-n2" r={16}>
          <circle cx={4} cy={-4} r={4.5} className="hp-stroke-only" strokeWidth="1.8" />
          <path
            d="M1 -1 L-7 7 M-5 5 L-8 8 M-3 7 L-6 10"
            className="hp-stroke-only"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={320} cy={62} className="hp-n3">
          <text textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="700">
            AI
          </text>
        </ProcessNode>

        <g className="hp-node hp-n4">
          <rect className="hp-node-ring" x={400} y={62} width={56} height={28} rx={6} />
          <text
            className="hp-node-icon"
            x={428}
            y={80}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="700"
          >
            API
          </text>
        </g>

        <ProcessNode cx={540} cy={88} className="hp-n5">
          <ellipse className="hp-stroke-only" cx={0} cy={0} rx={8} ry={5} strokeWidth="1.7" />
          <circle r="2.2" />
        </ProcessNode>

        <ProcessNode cx={160} cy={220} className="hp-n6" r={15}>
          <path
            className="hp-stroke-only"
            d="M-6 1 L-2 5 L7 -6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ProcessNode>

        <ProcessNode cx={250} cy={268} className="hp-n7" r={15}>
          <path
            className="hp-stroke-only"
            d="M-5 -5 L5 5 M5 -5 L-5 5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={440} cy={258} className="hp-n8" r={15}>
          <circle className="hp-stroke-only" r="6" strokeWidth="1.7" />
          <path
            className="hp-stroke-only"
            d="M0 -3 V1 L3 3"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={500} cy={258} className="hp-n9" r={15}>
          <path
            className="hp-stroke-only"
            d="M-6 2 V-1 L0 -6 L6 -1 V2 Z M-3 2 V5 H3 V2"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </ProcessNode>

        <ProcessNode cx={220} cy={460} className="hp-n10" r={14}>
          <path
            className="hp-stroke-only"
            d="M-5 1 L-1 5 L6 -5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={300} cy={460} className="hp-n11" r={14}>
          <circle r="2.5" />
        </ProcessNode>

        <ProcessNode cx={380} cy={460} className="hp-n12" r={14}>
          <path
            className="hp-stroke-only"
            d="M-5 1 L-1 5 L6 -5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </ProcessNode>

        <g className="hp-task" transform="translate(248 545)">
          <rect className="hp-task-body" width={104} height={72} rx={8} />
          <rect className="hp-task-accent" x={10} y={12} width={48} height={6} rx={2} />
          <rect className="hp-task-accent" x={10} y={26} width={84} height={4} rx={2} opacity={0.55} />
          <rect className="hp-task-accent" x={10} y={36} width={70} height={4} rx={2} opacity={0.4} />
          <rect className="hp-task-accent" x={10} y={46} width={54} height={4} rx={2} opacity={0.3} />
          <rect className="hp-task-accent" x={70} y={54} width={24} height={10} rx={3} />
        </g>

        <g transform="translate(600 120)">
          <circle r={34} fill="url(#hp-moon-grad)" stroke="#aeb3ac" strokeWidth="1.5" />
          <circle cx={-10} cy={-8} r={6} fill="#c5c9c2" opacity={0.7} />
          <circle cx={12} cy={4} r={4.5} fill="#c5c9c2" opacity={0.55} />
          <circle cx={-4} cy={14} r={3.5} fill="#c5c9c2" opacity={0.5} />
          <circle cx={14} cy={-12} r={2.5} fill="#c5c9c2" opacity={0.45} />
          <circle className="hp-moon-halo" r={38} fill="none" stroke="#72c600" strokeWidth="2" />
        </g>

        <g className="hp-rocket-group">
          <g className="hp-flame">
            <path
              d="M-7 27 C-9 41, -3 49, 0 55 C3 49, 9 41, 7 27 Z"
              fill="url(#hp-flame-grad)"
            />
            <path
              d="M-3 29 C-4 37, -1 43, 0 47 C1 43, 4 37, 3 29 Z"
              fill="#fff3b0"
              opacity={0.85}
            />
          </g>
          <path d="M-11 18 L-16 30 L-5 24 Z" fill="#4fa000" />
          <path d="M11 18 L16 30 L5 24 Z" fill="#4fa000" />
          <path
            d="M0 -28 C10 -10, 11 8, 9 22 L0 28 L-9 22 C-11 8, -10 -10, 0 -28 Z"
            fill="#343638"
          />
          <path
            d="M0 -28 C6 -14, 7 2, 6 14 L0 18 L-6 14 C-7 2, -6 -14, 0 -28 Z"
            fill="#72c600"
          />
          <circle cy={-8} r={5} fill="#d9f5b0" stroke="#4fa000" strokeWidth="1.4" />
          <rect x={-3} y={20} width={6} height={6} rx={1} fill="#8d8d8d" />
        </g>
      </svg>
    </div>
  );
}
