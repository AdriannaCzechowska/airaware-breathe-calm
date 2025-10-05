import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Timer, Music, Headphones } from "lucide-react";
import MobileContainer from "@/components/MobileContainer";

type Phase = {
  label: "Inhale" | "Hold" | "Exhale";
  duration: number;
  edge: 0 | 1 | 2 | 3;
  color: string;
  hint: string;
};

type Point = { x: number; y: number };

const Focus = () => {
  const navigate = useNavigate();

  // ---------------- BOX BREATHING 4-4-4-4 ----------------
  const phases = useMemo<Phase[]>(
    () => [
      { label: "Inhale", duration: 4, edge: 0, color: "#3b82f6", hint: "Inhale through your nose" },
      { label: "Hold",   duration: 4, edge: 1, color: "#60a5fa", hint: "Hold – keep shoulders relaxed" },
      { label: "Exhale", duration: 4, edge: 2, color: "#2563eb", hint: "Exhale gently through mouth" },
      { label: "Hold",   duration: 4, edge: 3, color: "#93c5fd", hint: "Hold – stay calm" },
    ],
    []
  );
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [edgeProgress, setEdgeProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const current = phases[phaseIdx];

  // Square geometry
  const size = 220; // 
  const pad = 24;
  const left = pad, top = pad, right = size - pad, bottom = size - pad;
  const s0: Point = { x: left,  y: top };
  const s1: Point = { x: right, y: top };
  const s2: Point = { x: right, y: bottom };
  const s3: Point = { x: left,  y: bottom };

  const edges: [Point, Point][] = [
    [s0, s1], [s1, s2], [s2, s3], [s3, s0],
  ];

  const [a, b] = edges[current.edge];
  const dotX = a.x + (b.x - a.x) * edgeProgress;
  const dotY = a.y + (b.y - a.y) * edgeProgress;

  const stopBreathTimers = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    rafRef.current = null;
    countdownRef.current = null;
    timeoutRef.current = null;
  };

  useEffect(() => {
    if (!isBreathing) {
      stopBreathTimers();
      return;
    }
    setTimeLeft(current.duration);
    setEdgeProgress(0);
    startTimeRef.current = performance.now();

    const animate = (t: number) => {
      const progress = (t - startTimeRef.current) / (current.duration * 1000);
      setEdgeProgress(progress < 1 ? progress : 1);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    countdownRef.current = window.setInterval(() => {
      setTimeLeft((x) => (x > 0 ? x - 1 : 0));
    }, 1000);

    timeoutRef.current = window.setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % phases.length);
    }, current.duration * 1000);

    return stopBreathTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreathing, phaseIdx]);

  useEffect(() => {
    if (isBreathing) setTimeLeft(current.duration);
  }, [phaseIdx, isBreathing, current.duration]);

  const ring = "#60a5fa22";
  const fillSoft = "#60a5fa15";

  // ---------------- POMODORO ----------------
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(minutes * 60);
  const pomodoroIntervalRef = useRef<number | null>(null);

  // mm:ss
  const fmt = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Start/stop interval
  useEffect(() => {
    if (!isPomodoroActive) {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
        pomodoroIntervalRef.current = null;
      }
      return;
    }

    pomodoroIntervalRef.current = window.setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          if (pomodoroIntervalRef.current) {
            clearInterval(pomodoroIntervalRef.current);
            pomodoroIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
        pomodoroIntervalRef.current = null;
      }
    };
  }, [isPomodoroActive]);

  
  const setPreset = (m: number) => {
    setIsPomodoroActive(false);
    setMinutes(m);
    setPomodoroSeconds(m * 60);
  };

  
  useEffect(() => {
    setPomodoroSeconds(minutes * 60);
  }, [minutes]);

  return (
    <MobileContainer>
      <div className="h-full bg-gradient-hero px-6 py-8 animate-fade-in overflow-y-auto">
        <div className="space-y-6 pb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/menu")}
            className="mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Back to Menu</span>
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Focus</h1>
            <p className="text-muted-foreground">Energize your mind and concentration</p>
          </div>

          {/* BOX BREATHING */}
          <Card className="p-8 bg-card border-0 shadow-soft">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-foreground text-lg">Box Breathing</h3>
                <p className="text-sm text-muted-foreground">Equal breath for mental clarity</p>
              </div>

              {/* Kwadrat z kropką + licznik w środku */}
              <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="absolute top-0 left-0">
                  <rect
                    x={left}
                    y={top}
                    width={right - left}
                    height={bottom - top}
                    rx={16}
                    ry={16}
                    fill={fillSoft}
                    stroke={ring}
                    strokeWidth={4}
                  />
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={current.color}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                  <g>
                    <circle cx={dotX} cy={dotY} r={7} fill={current.color} />
                    <circle cx={dotX} cy={dotY} r={14} fill={current.color} opacity={0.25} />
                  </g>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center leading-tight px-3">
                    <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                      {current.label}
                    </div>
                    <div className="font-semibold text-[#1d4ed8] tabular-nums text-4xl sm:text-5xl">
                      {timeLeft}s
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground px-4 -mt-2">
                {current.hint}
              </div>

              <Button
                onClick={() => {
                  const next = !isBreathing;
                  setIsBreathing(next);
                  if (next) {
                    setPhaseIdx(0);
                    setTimeLeft(phases[0].duration);
                    setEdgeProgress(0);
                  } else {
                    stopBreathTimers();
                  }
                }}
                size="lg"
                className="w-full py-6 inline-flex items-center justify-center gap-2"
              >
                {isBreathing ? (
                  <>
                    <Pause className="h-4 w-4 shrink-0" />
                    <span>Stop Exercise</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 shrink-0" />
                    <span>Start Exercise</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Focus Music */}
          <Card className="p-6 bg-card border-0 shadow-card space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-secondary/10 p-3 rounded-xl">
                <Headphones className="w-5 h-5 text-secondary shrink-0" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">Focus Music</h3>
            </div>

            <div className="space-y-3">
              {[
                { name: "Study Beats", genre: "Lo-Fi Hip Hop" },
                { name: "Deep Focus", genre: "Ambient Electronic" },
                { name: "Brain Food", genre: "Binaural Beats" },
              ].map((playlist) => (
                <div
                  key={playlist.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Music className="w-4 h-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{playlist.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{playlist.genre}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Pomodoro Timer */}
          <Card className="p-6 bg-card border-0 shadow-card">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Timer className="w-5 h-5 text-primary shrink-0" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">Pomodoro Timer</h3>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {fmt(pomodoroSeconds)}
                </div>
                <p className="text-sm text-muted-foreground">Work session</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreset(25)}>25 min</Button>
                <Button variant="outline" size="sm" onClick={() => setPreset(15)}>15 min</Button>
                <Button variant="outline" size="sm" onClick={() => setPreset(5)}>5 min</Button>
              </div>

              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => setIsPomodoroActive((v) => !v)}
                  className="flex-1 inline-flex items-center justify-center gap-2"
                >
                  {isPomodoroActive ? (
                    <>
                      <Pause className="h-4 w-4 shrink-0" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 shrink-0" />
                      <span>Start</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setIsPomodoroActive(false); setPomodoroSeconds(minutes * 60); }}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Focus;


