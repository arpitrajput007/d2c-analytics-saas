# Robot + iPad Scroll-Pinned Hero — Copy Guide

A reusable, drop-in hero section inspired by ChainGPT's robot scroll-scene,
tailored for **PocketDashboard**.

As the user scrolls, the iPad content and headline swap across 3 scenes,
while a cute 3D robot mascot holds the tablet. Dashboard content also
auto-scrolls inside the tablet (infinite loop) for constant motion.

## Live preview

Open the root of this Emergent app. The whole landing page mounts this
component in `App.js`.

## Files to copy into your Next.js / Vite / CRA repo

All paths below are relative to your `src/`.

```
src/
└── components/hero/
    ├── RobotIpadHero.jsx          # main orchestrator (scroll pinning + layout)
    ├── IpadFrame.jsx              # pure-CSS tablet shell
    ├── DashboardScroller.jsx      # infinite auto-scroll + scene swap
    ├── RobotFallback.jsx          # SVG mascot (used if PNG is missing)
    ├── Sparkline.jsx              # tiny svg line chart
    └── dashboards/
        ├── ProfitScene.jsx        # Scene 1 — KPIs + profit chart
        ├── OrdersScene.jsx        # Scene 2 — funnel + RTO + SKU margin
        └── CopilotScene.jsx       # Scene 3 — AI insights stream
```

Plus:

- `public/robot-mascot.png` — 1:1 PNG of the robot on solid black
  background. Black is knocked out at render time with
  `mix-blend-mode: screen`, so any dark SaaS bg works.
- CSS utilities added to `index.css` (look for the
  “Landing page custom” section — copy the whole block).

## Required deps

Already in most SaaS stacks:

- `react` (18+)
- `lucide-react` (icons)
- Tailwind CSS (optional — all layout classes are Tailwind; if you don't
  use Tailwind you can replace them with plain CSS quickly since the
  heavy styling sits in `index.css`).

No animation library, no ScrollTrigger, no GSAP — pure React +
`window.scroll` listener.

## Mount it

```jsx
import RobotIpadHero from "@/components/hero/RobotIpadHero";

export default function Page() {
  return (
    <main className="dark bg-[var(--bg-0)] text-white">
      <Navbar />
      <RobotIpadHero />
      {/* rest of your page */}
    </main>
  );
}
```

The hero wrapper is `320vh` tall — that's the scroll distance across
which the three scenes interpolate. Tune it with the `height` prop /
inline style in `RobotIpadHero.jsx`.

## Customising scenes

Open `RobotIpadHero.jsx` and edit the `headlines` array (3 items —
kicker, title, sub, body). The scene index drives:

1. Which headline is shown on the left.
2. Which dashboard is shown inside the iPad
   (see `scenes` array in `DashboardScroller.jsx`).
3. Which set of floating callouts appears around the iPad
   (see `FloatingCallouts` at the bottom of `RobotIpadHero.jsx`).

To add a 4th scene, push to all three arrays and change the `progress`
thresholds in the scroll handler.

## Regenerating the robot mascot

`scripts/generate_robot_openai.py` uses the `EMERGENT_LLM_KEY` +
OpenAI `gpt-image-1` to render a 1:1 PNG on a solid black background.
The black is composited out at render time via `mix-blend-mode: screen`.

```
python scripts/generate_robot_openai.py
```

The resulting image is written to `frontend/public/robot-mascot.png`.

## Notes / gotchas

- `mix-blend-mode: screen` only looks clean against a dark page
  background. Keep the surrounding section dark (`#05060B` in this
  implementation).
- The auto-scroll track duplicates the scene and uses
  `transform: translateY(-50%)` at 100% — if you change the scene
  height, the loop will still be seamless.
- On reduced-motion systems, you may want to disable
  `.auto-scroll-track` and `.float-slow` via
  `@media (prefers-reduced-motion)`.
