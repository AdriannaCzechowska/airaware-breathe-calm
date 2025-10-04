import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Brain, Leaf, Moon, Target } from "lucide-react";
import MobileContainer from "@/components/MobileContainer";
import gif from "@/assets/my-animation.gif";

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Stress Reduction",
      icon: Brain,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      path: "/stress"
    },
    {
      title: "Allergies & Asthma Management",
      icon: Leaf,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/allergies"
    },
    {
      title: "Better Sleep",
      icon: Moon,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      path: "/sleep"
    },
    {
      title: "Focus",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/focus"
    }
  ];

  return (
    <MobileContainer>
      <div className="relative h-full overflow-hidden bg-gradient-hero px-10 py-16 animate-fade-in">
        <div className="space-y-8 z-10 relative">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              What is your goal today?
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="p-6 cursor-pointer active:scale-95 transition-all duration-150 bg-card border-0 shadow-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${item.bgColor} p-4 rounded-2xl`}>
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 🌬️ GIF przyklejony do dołu */}
        <img
          src={gif}
          alt="Animated air effect"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-120 opacity-80 pointer-events-none z-50"
        />
      </div>
    </MobileContainer>
  );
};

export default MainMenu;
