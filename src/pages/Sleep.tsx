import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Moon, Music2 } from "lucide-react";
import AirQualityWidget from "@/components/AirQualityWidget";
import MobileContainer from "@/components/MobileContainer";

const Sleep = () => {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

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
            Better Sleep
          </h1>
          <p className="text-muted-foreground">
            Wind down and prepare for rest
          </p>
        </div>

        <Card className="p-8 bg-card border-0 shadow-soft">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-secondary/10 p-6 rounded-full">
              <Moon className="w-16 h-16 text-secondary" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground text-lg">
                4-7-8 Breathing Technique
              </h3>
              <p className="text-sm text-muted-foreground">
                A natural tranquilizer for the nervous system
              </p>
            </div>

            <div className={`text-center ${isBreathing ? "animate-pulse-soft" : ""}`}>
              <div className="text-4xl font-bold text-primary mb-2">
                {isBreathing ? "Breathe" : "Ready"}
              </div>
              <p className="text-sm text-muted-foreground">
                Inhale 4s • Hold 7s • Exhale 8s
              </p>
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
                  Start Wind-Down
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-0 shadow-card space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Music2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              Sleep Sounds
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { name: "Rain & Thunder", duration: "45 min" },
              { name: "Ocean Waves", duration: "60 min" },
              { name: "Forest Night", duration: "30 min" }
            ].map((sound) => (
              <div
                key={sound.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{sound.name}</p>
                  <p className="text-xs text-muted-foreground">{sound.duration}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                >
                  {isMusicPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-accent border-0">
          <h3 className="font-semibold text-accent-foreground mb-2">
            Sleep Tip
          </h3>
          <p className="text-sm text-accent-foreground/80">
            The 4-7-8 technique helps slow your heart rate and promotes relaxation. 
            Practice this technique lying in bed for best results.
          </p>
        </Card>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Sleep;
