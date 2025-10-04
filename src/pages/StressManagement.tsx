import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Music } from "lucide-react";
// import AirQualityWidget from "@/components/AirQualityWidget"; ← removed
import MobileContainer from "@/components/MobileContainer";

type Phase = {
  label: "Inhale" | "Hold" | "Exhale";
  duration: number; // seconds
  edge: 0 | 1 | 2;  // which triangle edge the dot travels on
  color: string;    // accent color for this phase
  hint: string;     // small helper text
};

const StressManagement = () => {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Triangle Breathing 5-5-5
  const phases = useMemo<Phase[]>(
    () => [
      { label: "Inhale", duration: 5, edge: 0, color: "#5fe3a1", hint: "Inhale through your nose" },
      { label: "Hold",   duration: 5, edge: 1, color: "#7cc5ff", hint: "Hold – relax shoulders" },
      { label: "Exhale", duration: 5, edge: 2, color: "#1d7b55", hint: "Exhale gently through mouth" },
    ],
    []
  );

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);

  // Smooth progress along current edge [0..1]
  const [edgeProgress, setEdgeProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const current = phases[phaseIdx];

  // Triangle geometry (equilateral), responsive to container size
  const size = 220; // SVG viewbox size (px)
  const cx = size / 2;
  const cy = size / 2;
  const r = 90; // triangle radius
  const p0 = { x: cx, y: cy - r }; // top
  const p1 = { x: cx - r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) }; // bottom-left
  const p2 = { x: cx + r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) }; // bottom-right

  const edges = [
    [p0, p1], // Inhale
    [p1, p2], // Hold
    [p2, p0], // Exhale
  ] as const;

  // Compute dot position along current edge
  const [a, b] = edges[current.edge];
  const dotX = a.x + (b.x - a.x) * edgeProgress;
  const dotY = a.y + (b.y - a.y) * edgeProgress;

  const stopAllTimers = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    rafRef.current = null;
    countdownRef.current = null;
    timeoutRef.current = null;
  };

  // Phase engine: RAF for smooth motion + 1s countdown + timeout to advance phase
  useEffect(() => {
    if (!isBreathing) {
      stopAllTimers();
      return;
    }

    // initialize phase
    setTimeLeft(current.duration);
    setEdgeProgress(0);
    startTimeRef.current = performance.now();

    // smooth edge progress
    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // seconds
      const p = Math.min(1, elapsed / current.duration);
      setEdgeProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    // per-second countdown
    countdownRef.current = window.setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000) as unknown as number;

    // move to next phase after duration
    timeoutRef.current = window.setTimeout(() => {
      const next = (phaseIdx + 1) % phases.length;
      setPhaseIdx(next);
    }, current.duration * 1000) as unknown as number;

    return () => {
      stopAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreathing, phaseIdx, current.duration]);

  // Colors per phase for subtle UI accents
  const bgRing = current.color + "33"; // translucent
  const fillSoft = current.color + "22";

  return (
    <MobileContainer>
      <div className="h-full bg-gradient-hero px-6 py-8 animate-fade-in overflow-y-auto">
        <div className="space-y-6 pb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/menu")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Stress Reduction</h1>
            <p className="text-muted-foreground">
              Triangle Breathing — 5 in • 5 hold • 5 out
            </p>
          </div>

          <Card className="p-8 bg-card border-0 shadow-soft">
            <div className="flex flex-col items-center space-y-6">
              {/* TRIANGLE + MOVING DOT */}
              <div className="relative" style={{ width: size, height: size }}>
                <svg
                  viewBox={`0 0 ${size} ${size}`}
                  width={size}
                  height={size}
                  className="block"
                >
                  {/* soft glow ring */}
                  <circle cx={cx} cy={cy} r={r + 18} fill="none" stroke={bgRing} strokeWidth="10" />
                  {/* triangle edges */}
                  <polygon
                    points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
                    fill={fillSoft}
                    stroke="#ffffff22"
                    strokeWidth="2"
                  />
                  {/* phase-highlighted edge */}
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={current.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* moving dot */}
                  <g filter="url(#dotGlow)">
                    <circle cx={dotX} cy={dotY} r="7" fill={current.color} />
                    <circle cx={dotX} cy={dotY} r="14" fill={current.color} opacity="0.25" />
                  </g>

                  {/* defs for glow */}
                  <defs>
                    <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* phase label + time */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {current.label}
                  </div>
                  <div className="text-4xl font-semibold tabular-nums leading-tight">
                    {timeLeft}s
                  </div>
                  <div className="text-sm text-muted-foreground">{current.hint}</div>
                </div>
              </div>

              {/* controls */}
              <Button
                onClick={() => {
                  const nextState = !isBreathing;
                  setIsBreathing(nextState);
                  if (nextState) {
                    // starting fresh from Inhale
                    setPhaseIdx(0);
                    setTimeLeft(phases[0].duration);
                    setEdgeProgress(0);
                  } else {
                    // pause everything precisely where it is
                    stopAllTimers();
                  }
                }}
                size="lg"
                className="w-full"
              >
                {isBreathing ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Exercise
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Breathing
                  </>
                )}
              </Button>
            </div>
          </Card>

            {/* Music card */}
          <Card className="p-6 bg-card border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 rounded-xl">
                  <Music className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Calm Music</h3>
                  <p className="text-sm text-muted-foreground">Nature sounds & ambient</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              >
                {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </Card>

          {/* How it works */}
          <Card className="p-6 bg-accent border-0">
            <h3 className="font-semibold text-accent-foreground mb-2">How it works</h3>
            <p className="text-sm text-accent-foreground/80">
              Triangle Breathing uses a steady 5–5–5 rhythm: inhale for 5, hold for 5,
              exhale for 5. The moving dot guides you along each edge to keep a smooth pace.
              This pattern boosts HRV, balances the autonomic nervous system, and reduces stress
              without making you drowsy.
            </p>
          </Card>
        </div>
      </div>
    </MobileContainer>
  );
};

export default StressManagement;

