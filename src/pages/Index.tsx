import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/MobileContainer";
import logo from "@/assets/logo.png";
import gif from "@/assets/my-animation.gif";



const Index = () => {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div className="h-full flex flex-col items-center justify-center bg-gradient-hero px-6 animate-fade-in">
        <div className="flex flex-col items-center space-y-8 w-full">
          <img 
            src={logo} 
            alt="AirAware Logo" 
            className="w-120 h-120 object-contain animate-fade-in cursor-pointer active:scale-95 transition-transform duration-300"
            onClick={() => navigate("/menu")}
          />
          
        

          <Button 
            onClick={() => navigate("/menu")}
            size="lg"
            className="w-36 mt-8 h-14 text-lg font-medium shadow-soft active:scale-95 transition-all duration-150"
          >
            Start
          </Button>
        </div>

        
      </div>
    </MobileContainer>
  );
};

export default Index;
