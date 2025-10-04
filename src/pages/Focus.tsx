import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Timer, Music, Headphones } from "lucide-react";
import AirQualityWidget from "@/components/AirQualityWidget";
import MobileContainer from "@/components/MobileContainer";

const Focus = () => {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [minutes, setMinutes] = useState(25);

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

        <AirQualityWidget />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Focus
          </h1>
          <p className="text-muted-foreground">
            Energize your mind and concentration
          </p>
        </div>

        <Card className="p-8 bg-card border-0 shadow-soft">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-foreground text-lg">
                Box Breathing
              </h3>
              <p className="text-sm text-muted-foreground">
                Equal breath for mental clarity
              </p>
            </div>

            <div className={`w-40 h-40 border-4 border-primary rounded-lg flex items-center justify-center ${
              isBreathing ? "animate-breathe" : ""
            }`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {isBreathing ? "4-4-4-4" : "Ready"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isBreathing ? "In • Hold • Out • Hold" : "Start to begin"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsBreathing(!isBreathing)}
              size="lg"
              className="w-full"
            >
              {isBreathing ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Exercise
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Energizing
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-0 shadow-card space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-secondary/10 p-3 rounded-xl">
              <Headphones className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              Focus Music
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { name: "Study Beats", genre: "Lo-Fi Hip Hop" },
              { name: "Deep Focus", genre: "Ambient Electronic" },
              { name: "Brain Food", genre: "Binaural Beats" }
            ].map((playlist) => (
              <div
                key={playlist.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Music className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground">{playlist.genre}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-0 shadow-card">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Timer className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">
                Pomodoro Timer
              </h3>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {minutes}:00
              </div>
              <p className="text-sm text-muted-foreground">
                Work session
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMinutes(25)}
              >
                25 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMinutes(15)}
              >
                15 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMinutes(5)}
              >
                5 min
              </Button>
            </div>

            <Button
              onClick={() => setIsPomodoroActive(!isPomodoroActive)}
              className="w-full"
            >
              {isPomodoroActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Timer
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Timer
                </>
              )}
            </Button>
          </div>
        </Card>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Focus;
