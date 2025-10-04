import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Music } from "lucide-react";
import AirQualityWidget from "@/components/AirQualityWidget";
import MobileContainer from "@/components/MobileContainer";

const StressManagement = () => {
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
            Stress Management
          </h1>
          <p className="text-muted-foreground">
            Take a moment to breathe and relax
          </p>
        </div>

        <Card className="p-8 bg-card border-0 shadow-soft">
          <div className="flex flex-col items-center space-y-6">
            <div 
              className={`w-48 h-48 rounded-full bg-gradient-calm flex items-center justify-center ${
                isBreathing ? "animate-breathe" : ""
              }`}
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isBreathing ? "Breathe..." : "Ready"}
                  </p>
                </div>
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

        <Card className="p-6 bg-accent border-0">
          <h3 className="font-semibold text-accent-foreground mb-2">
            How it works
          </h3>
          <p className="text-sm text-accent-foreground/80">
            Breathe in slowly for 4 counts, hold for 4, then breathe out for 4. 
            This controlled breathing reduces cortisol and activates your body's relaxation response.
          </p>
        </Card>
        </div>
      </div>
    </MobileContainer>
  );
};

export default StressManagement;
