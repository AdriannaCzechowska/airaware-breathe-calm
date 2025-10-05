import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeft, Play, Pause, RotateCcw, Moon } from "lucide-react";
import sleepGif from "@/assets/my-animation-sleep.gif";

type Phase = {
  label: "Inhale" | "Hold" | "Exhale";
  duration: number;        // seconds
  fromScale: number;
  toScale: number;
  color: string;
};

export default function Sleep() {
  const navigate = useNavigate();

  // ---------- UI state ----------
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [animScale, setAnimScale] = useState(1);

  // ---------- timing refs ----------
  const rafRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  // Ile ms upłynęło w aktualnej fazie (do wznowienia bez resetu)
  const elapsedMsRef = useRef<number>(0);
  // Czas rozpoczęcia (performance.now()) przy starcie/ wznowieniu fazy
  const phaseStartTsRef = useRef<number>(0);

  const phases = useMemo<Phase[]>(
    () => [
      { label: "Inhale", duration: 4, fromScale: 0.9, toScale: 1.1, color: "#7aa2ff" },
      { label: "Hold",   duration: 7, fromScale: 1.1, toScale: 1.1, color: "#9aa6ff" },
      { label: "Exhale", duration: 8, fromScale: 1.1, toScale: 0.9, color: "#3b3f5c" },
    ],
    []
  );

  const current = phases[phaseIdx];

  // ---------- utils ----------
  const clearAll = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

  // Uruchom/ wznów aktualną fazę od zadanego "elapsedMs"
  const runPhase = (phase: Phase, elapsedMs: number) => {
    const durationMs = phase.duration * 1000;
    const clampedElapsed = Math.min(Math.max(elapsedMs, 0), durationMs);

    // Ustaw start-time tak, aby animacja kontynuowała od clampedElapsed
    phaseStartTsRef.current = performance.now() - clampedElapsed;
    elapsedMsRef.current = clampedElapsed;

    setTimeLeft(Math.ceil((durationMs - clampedElapsed) / 1000));

    // licznik sekund (zsynchronizowany do pozostałego czasu)
    countdownRef.current = window.setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000) as unknown as number;

    const step = (now: number) => {
      const elapsed = now - phaseStartTsRef.current;
      elapsedMsRef.current = elapsed;
      const p = Math.min(1, elapsed / durationMs);
      const eased = easeInOut(p);

      const s = phase.fromScale + (phase.toScale - phase.fromScale) * eased;
      setAnimScale(s);

      if (p < 1 && isBreathing) {
        rafRef.current = requestAnimationFrame(step);
      } else if (p >= 1) {
        // Faza zakończona
        clearAll();
        elapsedMsRef.current = 0;
        if (isBreathing) {
          setPhaseIdx((prev) => (prev + 1) % phases.length);
        }
      }
    };

    // od razu przestaw kolor i cień poprzez re-render, animuje się tylko transform (rAF)
    rafRef.current = requestAnimationFrame(step);
  };

  // Główny efekt: gdy ruszamy/pauzujemy lub zmienimy fazę
  useEffect(() => {
    clearAll();
    if (isBreathing) {
      // Start/Resume aktualnej fazy z elapsedMsRef (0 przy nowej fazie)
      runPhase(current, elapsedMsRef.current);
    }
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreathing, phaseIdx]);

  // ---------- controls ----------
  const handleStartPause = () => {
    setIsBreathing((prev) => {
      const next = !prev;
      if (!prev && timeLeft === 0) {
        // był stop i nie było cofniętego czasu -> start od fazy 0
        setPhaseIdx(0);
        elapsedMsRef.current = 0;
      }
      return next;
    });
  };

  const handleReset = () => {
    clearAll();
    setIsBreathing(false);
    setPhaseIdx(0);
    setTimeLeft(phases[0].duration);
    setAnimScale(phases[0].fromScale);
    elapsedMsRef.current = 0;
  };

  // Stany wizualne
  const boxShadow =
    current.label === "Inhale"
      ? "0 0 30px rgba(255,255,255,0.25)"
      : current.label === "Exhale"
      ? "inset 0 0 50px rgba(0,0,0,0.25)"
      : "0 0 20px rgba(255,255,255,0.15)";

  return (
    <MobileContainer>
      <div className="h-full px-6 py-8 overflow-y-auto text-white bg-gradient-to-b from-[#050505] via-[#0c0f1a] to-[#1a1f2f]">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate("/menu")}
          className="mb-6 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <Moon className="h-5 w-5 text-indigo-300" />
          <h1 className="text-2xl font-semibold">4-7-8 Breathing</h1>
        </div>
        <p className="text-gray-300 mb-5">Inhale 4s • Hold 7s • Exhale 8s</p>

        {/* Kółko (rAF) */}
        <div className="relative mx-auto w-48 h-48">
          <div
            className="absolute inset-0 rounded-full ring-1 ring-white/20 backdrop-blur-sm"
            style={{
              transform: `scale(${animScale})`,
              backgroundColor: current.color,
              boxShadow,
              transition: "background-color 300ms linear, box-shadow 300ms linear",
              willChange: "transform",
            }}
          />
          <div className="absolute -inset-2 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* Timer + label */}
        <div className="mt-5 text-center">
          <div className="text-sm uppercase tracking-wider text-indigo-200/90">
            {current.label}
          </div>
          <div className="text-5xl font-semibold tabular-nums my-1">
            {timeLeft}s
          </div>
          <div className="text-gray-300 text-sm px-4">
            {current.label === "Inhale"
              ? "Inhale through your nose – slow and quiet"
              : current.label === "Hold"
              ? "Hold your breath – relax your body"
              : "Exhale through your mouth – gentle whoosh sound"}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button
            onClick={handleStartPause}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6"
          >
            {isBreathing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isBreathing ? "Pause" : "Start"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="rounded-2xl px-4 bg-white/10 hover:bg-white/15 text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* GIF — wysoko, nie blokuje kliknięć */}
        <div className="-mt-36 flex justify-center relative z-10 pointer-events-none">
          <img
            src={sleepGif}
            alt="Sleeping dog animation"
            className="w-72 h-auto -mb-8 object-contain"
          />
        </div>

        {/* How it works */}
        <div className="bg-black/30 ring-1 ring-white/10 rounded-2xl p-3 pt-4 mt-10">
          <h2 className="text-lg font-semibold mb-1">How it works</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The 4-7-8 breathing technique activates the parasympathetic nervous system and slows
            down your heart rate. The short 4-second inhale, followed by a 7-second hold and an
            extended 8-second exhale, helps lower cortisol levels and prepare your body for sleep.
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
