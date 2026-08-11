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
  r = 17,
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

function Junction({ x, y }: { x: number; y: number }) {
  return <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill="#aeb3ac" rx={1} />;
}

export function HomeProcessAnimation({ className = "" }: HomeProcessAnimationProps) {
  return (
    <div className={`home-process-anim pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 480"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="hp-moon-grad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f7f7f4" />
            <stop offset="55%" stopColor="#d9dcd8" />
            <stop offset="100%" stopColor="#b7bbb4" />
          </radialGradient>
          <linearGradient id="hp-flame-grad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffe566" />
            <stop offset="45%" stopColor="#ff9a1f" />
            <stop offset="100%" stopColor="#ff4d00" />
          </linearGradient>
        </defs>

        {/* Grid paths — left inputs converging through middle process to right task */}
        <g className="hp-grid">
          <path className="hp-grid-line" d="M70 110 H170 C220 110, 250 140, 280 180" />
          <path className="hp-grid-line" d="M70 190 H160 C210 190, 250 200, 290 220" />
          <path className="hp-grid-line" d="M70 270 H180 C230 270, 260 250, 300 240" />
          <path className="hp-grid-line" d="M55 340 H175 C230 340, 270 300, 310 260" />
          <path className="hp-grid-line" d="M190 70 V110 C190 140, 230 160, 280 180" />
          <path className="hp-grid-line" d="M250 70 V105 C250 135, 270 160, 300 190" />

          {/* Upper ladder / parallel rails */}
          <path className="hp-grid-line" d="M320 95 H430 M320 113 H430 M320 131 H430 M320 149 H430" />
          <path className="hp-grid-line" d="M320 95 V149 M430 95 V149" />
          <path className="hp-grid-line" d="M375 149 V185" />

          {/* Lower ladder */}
          <path className="hp-grid-line" d="M340 300 H460 M340 318 H460 M340 336 H460 M340 354 H460" />
          <path className="hp-grid-line" d="M340 300 V354 M460 300 V354" />
          <path className="hp-grid-line" d="M400 300 V250" />

          {/* Mid spine left → right */}
          <path className="hp-grid-line" d="M300 220 H480" />
          <path className="hp-grid-line" d="M480 220 H620" />
          <path className="hp-grid-line" d="M560 145 V220" />
          <path className="hp-grid-line" d="M620 220 H720" />

          {/* Three gate nodes into task */}
          <path className="hp-grid-line" d="M720 220 H780" />
          <path className="hp-grid-line" d="M760 180 V260" />
          <path className="hp-grid-line" d="M780 180 H820 M780 220 H820 M780 260 H820" />
          <path className="hp-grid-line" d="M820 180 V260" />
          <path className="hp-grid-line" d="M870 220 H920" />
        </g>

        {/* Concurrent currents flowing left → right */}
        <path
          className="hp-current-soft hp-current-a"
          d="M70 110 H170 C220 110, 250 140, 300 220 H480 H620 H780 H920"
        />
        <path
          className="hp-current-soft hp-current-b"
          d="M70 190 H160 C210 190, 250 200, 300 220 H560 H720 H820 H920"
        />
        <path
          className="hp-current-soft hp-current-c"
          d="M70 270 H180 C230 270, 260 250, 320 220 C380 185, 430 149, 480 220 H620 H780 H920"
        />
        <path
          className="hp-current-soft hp-current-d"
          d="M190 70 V110 C190 140, 250 170, 320 200 C380 230, 450 220, 560 220 H720 H860 H920"
        />

        <path
          className="hp-current hp-current-a"
          d="M70 110 H170 C220 110, 250 140, 300 220 H480 H620 H780 H920"
        />
        <path
          className="hp-current hp-current-b"
          d="M70 190 H160 C210 190, 250 200, 300 220 H560 H720 H820 H920"
        />
        <path
          className="hp-current hp-current-c"
          d="M70 270 H180 C230 270, 260 250, 320 220 C380 185, 430 149, 480 220 H620 H780 H920"
        />
        <path
          className="hp-current hp-current-d"
          d="M190 70 V110 C190 140, 250 170, 320 200 C380 230, 450 220, 560 220 H720 H860 H920"
        />

        <circle className="hp-spark hp-spark-a" cx="300" cy="220" r="3.5" />
        <circle className="hp-spark hp-spark-b" cx="480" cy="220" r="3.5" />
        <circle className="hp-spark hp-spark-c" cx="720" cy="220" r="3.5" />

        <Junction x={280} y={180} />
        <Junction x={300} y={220} />
        <Junction x={400} y={250} />
        <Junction x={480} y={220} />
        <Junction x={620} y={220} />
        <Junction x={780} y={220} />

        {/* Left inputs */}
        <ProcessNode cx={70} cy={110} className="hp-n1">
          <circle cy={-6} r={4.5} />
          <path d="M-8 4 C-8 -1, 8 -1, 8 4 V8 H-8 Z" />
        </ProcessNode>

        <ProcessNode cx={70} cy={190} className="hp-n2">
          <circle cx={4} cy={-4} r={4.5} className="hp-stroke-only" strokeWidth="1.8" />
          <path
            d="M1 -1 L-7 7 M-5 5 L-8 8 M-3 7 L-6 10"
            className="hp-stroke-only"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={70} cy={270} className="hp-n3">
          <text textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="700">
            AI
          </text>
        </ProcessNode>

        <g className="hp-node hp-n4">
          <rect className="hp-node-ring" x={28} y={325} width={54} height={28} rx={6} />
          <text
            className="hp-node-icon"
            x={55}
            y={339}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="700"
          >
            API
          </text>
        </g>

        <ProcessNode cx={190} cy={70} className="hp-n5" r={15}>
          <ellipse className="hp-stroke-only" cx={0} cy={0} rx={8} ry={5} strokeWidth="1.7" />
          <circle r="2.2" />
        </ProcessNode>

        <ProcessNode cx={250} cy={70} className="hp-n6" r={15}>
          <path
            className="hp-stroke-only"
            d="M-6 1 L-2 5 L7 -6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ProcessNode>

        {/* Mid process nodes */}
        <ProcessNode cx={380} cy={200} className="hp-n7" r={15}>
          <path
            className="hp-stroke-only"
            d="M-5 -5 L5 5 M5 -5 L-5 5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={480} cy={220} className="hp-n8" r={15}>
          <path
            className="hp-stroke-only"
            d="M-6 1 L-2 5 L7 -6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ProcessNode>

        <ProcessNode cx={560} cy={220} className="hp-n9" r={15}>
          <circle className="hp-stroke-only" r="6" strokeWidth="1.7" />
          <path
            className="hp-stroke-only"
            d="M0 -3 V1 L3 3"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </ProcessNode>

        <ProcessNode cx={560} cy={145} className="hp-n10" r={15}>
          <path
            className="hp-stroke-only"
            d="M-7 2 V0 L0 -7 L7 0 V2 Z M-3 2 V6 H3 V2"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </ProcessNode>

        {/* Three arrow / gate nodes */}
        <ProcessNode cx={720} cy={180} className="hp-n11" r={13}>
          <path d="M-4 -5 L5 0 L-4 5 Z" />
        </ProcessNode>
        <ProcessNode cx={720} cy={220} className="hp-n12" r={13}>
          <path d="M-4 -5 L5 0 L-4 5 Z" />
        </ProcessNode>
        <ProcessNode cx={720} cy={260} className="hp-n13" r={13}>
          <path d="M-4 -5 L5 0 L-4 5 Z" />
        </ProcessNode>

        {/* Final task panel */}
        <g className="hp-task" transform="translate(820 175)">
          <rect className="hp-task-body" width={100} height={90} rx={8} />
          <rect className="hp-task-accent" x={10} y={12} width={44} height={6} rx={2} />
          <rect className="hp-task-accent" x={10} y={28} width={80} height={4} rx={2} opacity={0.55} />
          <rect className="hp-task-accent" x={10} y={40} width={66} height={4} rx={2} opacity={0.4} />
          <rect className="hp-task-accent" x={10} y={52} width={52} height={4} rx={2} opacity={0.3} />
          <rect className="hp-task-accent" x={10} y={66} width={36} height={12} rx={3} />
          <rect className="hp-task-accent" x={54} y={66} width={36} height={12} rx={3} opacity={0.55} />
        </g>

        {/* Moon destination (far right) */}
        <g transform="translate(1140 100)">
          <circle r={36} fill="url(#hp-moon-grad)" stroke="#aeb3ac" strokeWidth="1.5" />
          <circle cx={-10} cy={-8} r={6} fill="#c5c9c2" opacity={0.7} />
          <circle cx={12} cy={4} r={4.5} fill="#c5c9c2" opacity={0.55} />
          <circle cx={-4} cy={14} r={3.5} fill="#c5c9c2" opacity={0.5} />
          <circle cx={14} cy={-12} r={2.5} fill="#c5c9c2" opacity={0.45} />
          <circle className="hp-moon-halo" r={42} fill="none" stroke="#72c600" strokeWidth="2" />
        </g>

        {/* Rocket — points roughly right, launches to moon */}
        <g className="hp-rocket-group">
          <g className="hp-flame">
            <path
              d="M-34 -6 C-48 -8, -56 -3, -62 0 C-56 3, -48 8, -34 6 Z"
              fill="url(#hp-flame-grad)"
            />
            <path
              d="M-32 -3 C-40 -4, -46 -1, -50 0 C-46 1, -40 4, -32 3 Z"
              fill="#fff3b0"
              opacity={0.85}
            />
          </g>
          <path d="M-18 -12 L-30 -18 L-24 -4 Z" fill="#4fa000" />
          <path d="M-18 12 L-30 18 L-24 4 Z" fill="#4fa000" />
          <path
            d="M28 0 C10 -10, -8 -11, -22 -9 L-28 0 L-22 9 C-8 11, 10 10, 28 0 Z"
            fill="#343638"
          />
          <path
            d="M28 0 C14 -7, -2 -8, -14 -6 L-20 0 L-14 6 C-2 8, 14 7, 28 0 Z"
            fill="#72c600"
          />
          <circle cx={8} cy={0} r={5} fill="#d9f5b0" stroke="#4fa000" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
}
