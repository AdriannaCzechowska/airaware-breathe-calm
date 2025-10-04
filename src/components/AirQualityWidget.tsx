import { Card } from "@/components/ui/card";
import { Wind, Flower2 } from "lucide-react";

interface AirQualityWidgetProps {
  aqi?: number;
  aqiLabel?: string;
  pollenLevel?: string;
}

const AirQualityWidget = ({ 
  aqi = 41, 
  aqiLabel = "Good", 
  pollenLevel = "Medium" 
}: AirQualityWidgetProps) => {
  return (
    <div className="flex gap-3 mb-6">
      <Card className="flex-1 p-3 bg-card border-0 shadow-card">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-secondary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">AQI</span>
            <span className="text-sm font-semibold text-foreground">
              {aqi} – {aqiLabel}
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="flex-1 p-3 bg-card border-0 shadow-card">
        <div className="flex items-center gap-2">
          <Flower2 className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Pollen</span>
            <span className="text-sm font-semibold text-foreground">
              {pollenLevel}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AirQualityWidget;
