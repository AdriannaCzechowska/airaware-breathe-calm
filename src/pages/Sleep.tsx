import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/MobileContainer";
import { ArrowLeft, Play, Pause, Moon } from "lucide-react";

type Phase = {
  label: "Inhale" | "Hold" | "Exhale";
  duration: number; // seconds
  scale: number; // 1 = base size
  color: string; // circle color
};

export default function Sleep() {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const phases = useMemo<Phase[]>(
    () => [
      { label: "Inhale", duration: 4, scale: 1.2, color: "#7aa2ff" },
      { label: "Hold", duration: 7, scale: 1.2, color: "#9aa6ff" },
      { label: "Exhale", duration: 8, scale: 0.8, color: "#3b3f5c" },
    ],
    []
  );

  const current = phases[phaseIdx];

  useEffect(() => {
    if (!isBreathing) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      timerRef.current = null;
      countdownRef.current = null;
      return;
    }

    setTimeLeft(current.duration);

    // countdown every second
    countdownRef.current = window.setInterval(() => {
      setTimeLeft((t) => (t > 1 ? t - 1 : 0));
    }, 1000) as unknown as number;

    // move to the next phase
    timerRef.current = window.setTimeout(() => {
      const next = (phaseIdx + 1) % phases.length;
      setPhaseIdx(next);
    }, current.duration * 1000) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, [isBreathing, phaseIdx, current.duration, phases.length]);

  return (
    <MobileContainer>
      <div className="h-full px-6 py-8 overflow-y-auto text-white bg-gradient-to-b from-[#050505] via-[#0c0f1a] to-[#1a1f2f]">
        <Button
          variant="ghost"
          onClick={() => navigate("/menu")}
          className="mb-6 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <Moon className="h-5 w-5 text-indigo-300" />
          <h1 className="text-2xl font-semibold">4-7-8 Breathing</h1>
        </div>
        <p className="text-gray-300 mb-6">Inhale 4s • Hold 7s • Exhale 8s</p>

        {/* 🔵 Animated circle */}
        <div className="relative mx-auto w-56 h-56">
          <div
            className="absolute inset-0 rounded-full ring-1 ring-white/20 backdrop-blur-sm transition-all ease-in-out"
            style={{
              transform: `scale(${current.scale})`,
              backgroundColor: current.color,
              transitionDuration: `${current.duration}s`,
              boxShadow:
                current.label === "Inhale"
                  ? "0 0 40px rgba(255,255,255,0.25)"
                  : current.label === "Exhale"
                  ? "inset 0 0 60px rgba(0,0,0,0.25)"
                  : "0 0 24px rgba(255,255,255,0.15)",
            }}
          />
          <div className="absolute -inset-3 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* 🕒 Phase label + timer */}
        <div className="mt-6 text-center">
          <div className="text-sm uppercase tracking-wider text-indigo-200/90">
            {current.label}
          </div>
          <div className="text-5xl font-semibold tabular-nums my-2">
            {timeLeft}s
          </div>
          <div className="text-gray-300 text-sm">
            {current.label === "Inhale"
              ? "Inhale through your nose – slow and quiet"
              : current.label === "Hold"
              ? "Hold your breath – relax your body"
              : "Exhale through your mouth – gentle whoosh sound"}
          </div>
        </div>

        {/* ▶️ Control buttons */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => {
              setIsBreathing((v) => !v);
              if (!isBreathing) {
                setPhaseIdx(0);
                setTimeLeft(phases[0].duration);
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6"
          >
            {isBreathing ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isBreathing ? "Pause" : "Start"}
          </Button>
        </div>

        {/* 💬 How it works */}
        <div className="mt-10 bg-black/30 ring-1 ring-white/10 rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-2">How it works</h2>
          <p className="text-gray-300">
            The 4-7-8 breathing technique activates the parasympathetic nervous
            system and slows down your heart rate. The short 4-second inhale,
            followed by a 7-second hold and an extended 8-second exhale, helps
            lower cortisol levels and prepare your body for sleep.
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}




