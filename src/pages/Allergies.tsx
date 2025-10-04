import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Bell, AlertCircle } from "lucide-react";
import AirQualityWidget from "@/components/AirQualityWidget";
import MobileContainer from "@/components/MobileContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Allergies = () => {
  const navigate = useNavigate();
  const [dailyReminder, setDailyReminder] = useState(true);

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

        <AirQualityWidget pollenLevel="High" />

        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">High Pollen Alert</h3>
              <p className="text-sm text-destructive/80 mt-1">
                Birch pollen levels are high today. Consider taking precautions.
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Ask My Allergies
          </h1>
          <p className="text-muted-foreground">
            Track symptoms and manage medications
          </p>
        </div>

        <Card className="p-6 bg-card border-0 shadow-card space-y-4">
          <h3 className="font-semibold text-foreground text-lg">Log Symptom</h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="symptom">Symptom Type</Label>
              <Select>
                <SelectTrigger id="symptom">
                  <SelectValue placeholder="Select symptom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sneezing">Sneezing</SelectItem>
                  <SelectItem value="itchy-eyes">Itchy Eyes</SelectItem>
                  <SelectItem value="runny-nose">Runny Nose</SelectItem>
                  <SelectItem value="congestion">Congestion</SelectItem>
                  <SelectItem value="cough">Cough</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any details about your symptoms..."
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Park" />
              </div>
            </div>

            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Log Symptom
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-0 shadow-card space-y-4">
          <h3 className="font-semibold text-foreground text-lg">
            Medication Reminder
          </h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="medication">Medication Name</Label>
              <Input id="medication" placeholder="e.g., Antihistamine" />
            </div>

            <div>
              <Label htmlFor="med-time">Reminder Time</Label>
              <Input id="med-time" type="time" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <Label htmlFor="daily" className="cursor-pointer">
                  Daily Reminder
                </Label>
              </div>
              <Switch
                id="daily"
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            </div>

            <Button variant="outline" className="w-full">
              Set Reminder
            </Button>
          </div>
        </Card>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Allergies;
