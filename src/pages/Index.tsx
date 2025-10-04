import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero px-6 animate-fade-in">
      <div className="flex flex-col items-center space-y-8 max-w-sm w-full">
        <img 
          src={logo} 
          alt="AirAware Logo" 
          className="w-64 h-64 object-contain animate-fade-in cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/menu")}
        />
        
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-primary tracking-tight">
            AirAware
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Breathe smarter. Live better.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/menu")}
          size="lg"
          className="w-full mt-8 h-14 text-lg font-medium shadow-soft hover:shadow-lg transition-all duration-300"
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default Index;
