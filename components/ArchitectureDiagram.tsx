/**
 * ArchitectureDiagram — the node-and-connector diagram used for the hero's
 * system overview and for each capability card's field architecture.
 *
 * Same shape everywhere, so the family reads as one system: three entry
 * points across the top, a full-width band in the middle, three stores along
 * the bottom. Each column drops straight into the band; each row is chained
 * sideways. Columns listed in `skipTopDrops` have no line down to the band —
 * used by the hero, where Users arrive through Web / Mobile rather than
 * talking to the backend directly.
 */

export type IconName =
  | "users" | "web" | "phone" | "window" | "api" | "server"
  | "db" | "bolt" | "drive" | "chat" | "mail" | "link"
  | "spark" | "vector" | "modules" | "sensor" | "cog" | "power"
  | "chip" | "gateway" | "globe" | "cloud" | "queue" | "replicas" | "chart"
  | "shield" | "balance";

function NodeIcon({ kind, x, y }: { kind: IconName; x: number; y: number }) {
  const t = `translate(${x} ${y})`;
  switch (kind) {
    case "users":
      return (
        <g transform={t}>
          <circle cx="0" cy="-3.5" r="3.6" />
          <path d="M-7 6.5a7 7 0 0 1 14 0" />
        </g>
      );
    case "web":
      return (
        <g transform={t}>
          <rect x="-8" y="-7" width="16" height="11" />
          <path d="M-3.5 7.5h7" />
        </g>
      );
    case "phone":
      return (
        <g transform={t}>
          <rect x="-5" y="-8" width="10" height="16" />
          <path d="M-1.5 5.5h3" />
        </g>
      );
    case "window":
      return (
        <g transform={t}>
          <rect x="-8" y="-6.5" width="16" height="13" />
          <path d="M-8-2.5h16" />
        </g>
      );
    case "api":
      return (
        <g transform={t}>
          <circle cx="0" cy="-5.5" r="2.8" />
          <circle cx="-6.5" cy="5" r="2.8" />
          <circle cx="6.5" cy="5" r="2.8" />
          <path d="M-1.6-3.1-4.6 2.6M1.6-3.1 4.6 2.6M-3.7 5h7.4" />
        </g>
      );
    case "server":
      return (
        <g transform={t}>
          <rect x="-8.5" y="-6.5" width="17" height="13" />
          <path d="M-8.5-2.2h17M-8.5 2.2h17" />
        </g>
      );
    case "db":
      return (
        <g transform={t}>
          <ellipse cx="0" cy="-4" rx="7.5" ry="3" />
          <path d="M-7.5-4v8c0 1.6 3.4 3 7.5 3s7.5-1.4 7.5-3v-8" />
          <path d="M-7.5 0c0 1.6 3.4 3 7.5 3s7.5-1.4 7.5-3" />
        </g>
      );
    case "bolt":
      return (
        <g transform={t}>
          <path d="M1.5-8-5.5 1h4.2l-1.2 7L5.5-1H1.2Z" />
        </g>
      );
    case "drive":
      return (
        <g transform={t}>
          <rect x="-8" y="-6" width="16" height="12" />
          <path d="M-8 0h16" />
          <circle cx="5" cy="3.4" r="1" />
        </g>
      );
    case "chat":
      return (
        <g transform={t}>
          <path d="M-8-6.5h16v10h-8l-5 4.5v-4.5h-3Z" />
        </g>
      );
    case "mail":
      return (
        <g transform={t}>
          <rect x="-8" y="-5.5" width="16" height="11" />
          <path d="M-8-5.5 0 0l8-5.5" />
        </g>
      );
    case "link":
      return (
        <g transform={t}>
          <path d="M-2-6.5a4.2 4.2 0 0 0 0 8.4h3.2M2 6.5a4.2 4.2 0 0 0 0-8.4H-1.2" />
        </g>
      );
    case "spark":
      return (
        <g transform={t}>
          <path d="M0-8.5 1.9-2.1 8.5 0 1.9 2.1 0 8.5-1.9 2.1-8.5 0-1.9-2.1Z" />
        </g>
      );
    case "vector":
      return (
        <g transform={t}>
          <circle cx="-5" cy="-5" r="2.2" />
          <circle cx="5" cy="-5" r="2.2" />
          <circle cx="-5" cy="5" r="2.2" />
          <circle cx="5" cy="5" r="2.2" />
          <path d="M-5-5h10v10h-10Z" />
        </g>
      );
    case "modules":
      return (
        <g transform={t}>
          <rect x="-7.5" y="-7.5" width="6.5" height="6.5" />
          <rect x="1" y="-7.5" width="6.5" height="6.5" />
          <rect x="-7.5" y="1" width="6.5" height="6.5" />
          <rect x="1" y="1" width="6.5" height="6.5" />
        </g>
      );
    case "sensor":
      return (
        <g transform={t}>
          <circle cx="0" cy="5.5" r="1.6" />
          <path d="M-4 1.5a6 6 0 0 1 8 0M-7.5-2.5a11 11 0 0 1 15 0" />
        </g>
      );
    case "cog":
      // teeth start at the rim so it reads as a gear, not a sun
      return (
        <g transform={t}>
          <circle cx="0" cy="0" r="4.2" />
          <circle cx="0" cy="0" r="1.3" />
          <path d="M0-6.9v2.7M0 4.2v2.7M-6.9 0h2.7M4.2 0h2.7M-4.9-4.9l1.9 1.9M3 3l1.9 1.9M4.9-4.9 3-3M-3 3l-1.9 1.9" />
        </g>
      );
    case "power":
      return (
        <g transform={t}>
          <rect x="-7.5" y="-4.5" width="13" height="9" />
          <path d="M5.5-2h2.5v4H5.5" />
          <path d="M-5-1.4h4M-5 1.4h6" />
        </g>
      );
    case "chip":
      return (
        <g transform={t}>
          <rect x="-6" y="-6" width="12" height="12" />
          <path d="M-3-9.5v3.5M3-9.5v3.5M-3 6v3.5M3 6v3.5M-9.5-3H-6M-9.5 3H-6M6-3h3.5M6 3h3.5" />
        </g>
      );
    case "gateway":
      return (
        <g transform={t}>
          <rect x="-8" y="-2" width="16" height="7" />
          <path d="M-4.5-2v-3.5M0-2v-6M4.5-2v-3.5" />
        </g>
      );
    case "cloud":
      return (
        <g transform={t}>
          <path d="M-7.5 5a3.8 3.8 0 0 1 .5-7.5 5.4 5.4 0 0 1 10.3 1.4A3.4 3.4 0 0 1 6.4 5Z" />
        </g>
      );
    case "globe":
      return (
        <g transform={t}>
          <circle cx="0" cy="0" r="7.5" />
          <path d="M-7.5 0h15M0-7.5a11.5 11.5 0 0 1 0 15 11.5 11.5 0 0 1 0-15" />
        </g>
      );
    case "queue":
      return (
        <g transform={t}>
          <rect x="-8" y="-6.5" width="16" height="5" />
          <rect x="-8" y="1.5" width="16" height="5" />
        </g>
      );
    case "replicas":
      return (
        <g transform={t}>
          <rect x="-8" y="-8" width="11" height="11" />
          <rect x="-3" y="-3" width="11" height="11" />
        </g>
      );
    case "chart":
      return (
        <g transform={t}>
          <path d="M-8 7h16M-8 7v-15" />
          <path d="M-5.5 2-1-3 2.5 0 7-6.5" />
        </g>
      );
    case "balance":
      // one input fanning out to two, i.e. a load balancer
      return (
        <g transform={t}>
          <path d="M0-8.5v6M0-2.5-6 2.5M0-2.5 6 2.5M-6 2.5v3.5M6 2.5v3.5" />
          <circle cx="-6" cy="7.5" r="1.4" />
          <circle cx="6" cy="7.5" r="1.4" />
        </g>
      );
    case "shield":
      return (
        <g transform={t}>
          <path d="M0-8.5-7-5.5v4.2c0 4.8 3.1 7.8 7 9 3.9-1.2 7-4.2 7-9v-4.2Z" />
        </g>
      );
    default:
      return null;
  }
}

export interface DiagramNode {
  label: string;
  icon: IconName;
}

/**
 * A stage is one horizontal row. `band` renders it as the full-width bar.
 * Row counts deliberately differ between diagrams — a three-tier app, an
 * agent pipeline and a device chain do not have the same shape, and forcing
 * them into one template is what makes a diagram look decorative.
 */
export interface DiagramStage {
  nodes: DiagramNode[];
  band?: boolean;
}

export interface DiagramSpec {
  caption?: string;
  stages: DiagramStage[];
  /** [stage, node] pairs with no drop line into the stage below */
  skipDrops?: [number, number][];
  /**
   * The route the signal takes, as [stage, node] pairs in visit order.
   * Defaults to reading order — rows top to bottom, boxes left to right.
   *
   * A diagram where the flow does not follow the layout has to say so: on the
   * device chain the actuators are drawn beside the sensors, but they are what
   * the system drives, so they are the last box to receive, not the second.
   */
  order?: [number, number][];
}

const BOX_W = 90;
const BOX_H = 74;
const BAND_H = 40;
const ROW_GAP = 26;
const PAD = 5;
const VIEW_W = 300;

/**
 * Connector paths from one stage to the next.
 *
 * A band spans the row, so it can drop straight onto every node below it —
 * that case used to be skipped entirely, which left the stage under a band
 * floating. When the two rows differ in width (one gateway feeding two
 * services), straight drops would land between the boxes, so those route
 * through a short horizontal bus instead.
 */
type LaidStage = DiagramStage & { y: number; h: number };

/**
 * A connector, and the slot its pulse fires in.
 *
 * A pulse carries the signal from one box to the next, so it always runs from
 * the endpoint the signal reaches *first* toward the one it reaches second,
 * and fires one slot before that second box lights. That holds whichever way
 * the line happens to be drawn — the drop into the actuators runs back up the
 * page, because the firmware is what drives them.
 *
 * Where several sources feed one destination (two clients calling one
 * backend) their pulses share a slot and travel together; that is what a fan-in
 * looks like. A bus has one trunk but several landings, so the trunk takes the
 * first landing's slot.
 */
interface Route {
  d: string;
  slot: number;
}

type SlotOf = (si: number, ni: number) => number;

function routes(
  from: LaidStage,
  to: LaidStage,
  si: number,
  skipped: Set<string>,
  slotOf: SlotOf,
): Route[] {
  const y0 = from.y + from.h;
  const y1 = to.y;

  /** A drop between the two rows, drawn in the direction the signal travels. */
  const drop = (x: number, above: number, below: number): Route =>
    above < below
      ? { d: `M${x} ${y0}V${y1}`, slot: below - 1 }
      : { d: `M${x} ${y1}V${y0}`, slot: above - 1 };

  if (from.band && to.band)
    return [drop(VIEW_W / 2, slotOf(si, 0), slotOf(si + 1, 0))];
  if (from.band)
    return positions(to.nodes.length).map((x, i) =>
      drop(x, slotOf(si, 0), slotOf(si + 1, i)),
    );

  const src = positions(from.nodes.length)
    .map((x, ni) => ({ x, ni }))
    .filter(({ ni }) => !skipped.has(`${si}:${ni}`));

  if (to.band || src.length === to.nodes.length) {
    const bandSlot = to.band ? slotOf(si + 1, 0) : 0;
    return src.map(({ x, ni }, i) =>
      drop(
        to.band ? x : positions(to.nodes.length)[i],
        slotOf(si, ni),
        to.band ? bandSlot : slotOf(si + 1, i),
      ),
    );
  }

  // One box feeding several, or several feeding one: straight drops would land
  // in the gap between boxes, so the run goes down, across, and down again.
  const dst = positions(to.nodes.length);
  const midY = (y0 + y1) / 2;
  const trunkSlot = slotOf(si, src[0].ni);
  return [
    ...src.map(({ x }) => ({ d: `M${x} ${y0}V${midY}`, slot: trunkSlot })),
    {
      d: `M${Math.min(...dst)} ${midY}H${Math.max(...dst)}`,
      slot: trunkSlot,
    },
    ...dst.map((x, i) => ({
      d: `M${x} ${midY}V${y1}`,
      slot: slotOf(si + 1, i) - 1,
    })),
  ];
}

/**
 * The line chaining two neighbouring boxes in a row, drawn in the direction
 * the signal walks it.
 *
 * It only carries a pulse where the two boxes are consecutive stops on the
 * route. Boxes drawn side by side are not always neighbours in the flow — the
 * actuators sit next to the sensors and are wired to the same controller, but
 * nothing travels between them, and a pulse there would show the signal
 * reaching the actuators four steps before they light. `slot` is null for
 * those: the wire stays, the signal does not run down it.
 */
function chain(st: LaidStage, xs: number[], ni: number, slotOf: SlotOf, si: number) {
  const left = xs[ni] + BOX_W / 2;
  const right = xs[ni + 1] - BOX_W / 2;
  const y = st.y + st.h / 2;
  const a = slotOf(si, ni);
  const b = slotOf(si, ni + 1);
  return {
    d: a < b ? `M${left} ${y}h${right - left}` : `M${right} ${y}h${left - right}`,
    slot: Math.abs(a - b) === 1 ? Math.min(a, b) : null,
  };
}

/** Centre x for each box in a row of n. */
function positions(n: number): number[] {
  if (n === 1) return [VIEW_W / 2];
  if (n === 2) return [87.5, 212.5];
  return [50, 150, 250];
}

export function ArchitectureDiagram({ spec }: { spec: DiagramSpec }) {
  const { caption, stages, skipDrops = [], order } = spec;
  const skipped = new Set(skipDrops.map(([sIdx, nIdx]) => `${sIdx}:${nIdx}`));

  // lay the stages out top to bottom, remembering each one's y and height
  let y = 6;
  const laid = stages.map((st) => {
    const h = st.band ? BAND_H : BOX_H;
    const row = { ...st, y, h };
    y += h + ROW_GAP;
    return row;
  });
  const viewH = y - ROW_GAP + 6;

  // When the signal reaches each box. Without an explicit route that is
  // reading order; every box still needs its own slot, or the row lights as
  // one. A spec that names a box twice, or forgets one, leaves a box with no
  // slot to animate from — so that fails the build rather than shipping a
  // diagram that quietly animates wrong.
  const slots = new Map<string, number>();
  const route =
    order ?? laid.flatMap((st, si) => st.nodes.map((_, ni) => [si, ni] as [number, number]));
  route.forEach(([si, ni], k) => slots.set(`${si}:${ni}`, k));

  const slotOf: SlotOf = (si, ni) => {
    const slot = slots.get(`${si}:${ni}`);
    if (slot === undefined)
      throw new Error(
        `${caption ?? "ArchitectureDiagram"}: ${route.length} boxes routed, but ` +
          `stage ${si} node ${ni} is not among them`,
      );
    return slot;
  };

  return (
    <div className="arch-diagram flex h-full flex-col">
      {caption && (
        <p
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
          className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
        >
          {caption}
        </p>
      )}

      <svg
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        fill="none"
        className="w-full"
        role="img"
        aria-label={
          caption
            ? `${caption}: ` +
              stages
                .map((st) => st.nodes.map((n) => n.label).join(" and "))
                .join(", then ")
            : "Architecture diagram"
        }
      >
        {/* connectors from each stage to the next: a static line, with a pulse
            that carries the signal along it once per cycle */}
        <g stroke="var(--accent-green)" strokeWidth="1">
          {laid.slice(0, -1).flatMap((st, si) =>
            routes(st, laid[si + 1], si, skipped, slotOf).map((r, i) => (
              <path key={`${si}-${i}`} d={r.d} />
            )),
          )}
        </g>
        <g
          stroke="var(--accent-green)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        >
          {laid.slice(0, -1).flatMap((st, si) =>
            routes(st, laid[si + 1], si, skipped, slotOf).map((r, i) => (
              <path
                key={`${si}-${i}`}
                className="arch-pulse"
                pathLength={100}
                style={{ "--arch-slot": r.slot } as React.CSSProperties}
                d={r.d}
              />
            )),
          )}
        </g>

        {/* boxes, bands and the sideways chain within each row */}
        {laid.map((st, si) => {
          const xs = positions(st.nodes.length);
          return (
            <g key={si}>
              {st.nodes.map((n, ni) => {
                // the run of wire this box shares with the next one along
                const link =
                  !st.band && ni < st.nodes.length - 1
                    ? chain(st, xs, ni, slotOf, si)
                    : null;
                return (
                <g key={n.label}>
                  <rect
                    className={st.band ? "arch-node arch-band" : "arch-node"}
                    x={st.band ? PAD : xs[ni] - BOX_W / 2}
                    y={st.y}
                    width={st.band ? VIEW_W - PAD * 2 : BOX_W}
                    height={st.h}
                    fill="var(--bg-raised)"
                    style={{ "--arch-slot": slotOf(si, ni) } as React.CSSProperties}
                  />
                  <g
                    stroke="var(--accent-green)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <NodeIcon
                      kind={n.icon}
                      x={st.band ? 98 : xs[ni]}
                      y={st.y + st.h / 2 + (st.band ? 0 : -9)}
                    />
                  </g>
                  <text
                    x={st.band ? 118 : xs[ni]}
                    y={st.band ? st.y + st.h / 2 + 4.5 : st.y + st.h - 14}
                    textAnchor={st.band ? "start" : "middle"}
                    fontSize={st.band ? 13.5 : 12}
                    fill="var(--text-primary)"
                    fontFamily="var(--font-inter)"
                  >
                    {n.label}
                  </text>

                  {/* chain the boxes in a row together — the signal walks
                      along this too, so it carries a pulse like any other
                      connector */}
                  {link && (
                    <>
                      <path
                        stroke="var(--accent-green)"
                        strokeWidth="1"
                        d={link.d}
                      />
                      {link.slot !== null && (
                        <path
                          className="arch-pulse"
                          pathLength={100}
                          stroke="var(--accent-green)"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          style={{ "--arch-slot": link.slot } as React.CSSProperties}
                          d={link.d}
                        />
                      )}
                    </>
                  )}
                </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
