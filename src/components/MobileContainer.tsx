import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

const MobileContainer = ({ children }: MobileContainerProps) => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-[430px] min-h-[932px] bg-background rounded-[3rem] shadow-2xl overflow-hidden border-8 border-foreground/10 relative">
        {/* Status Bar */}
        <div className="h-12 bg-background flex items-center justify-between px-8 pt-2">
          <span className="text-xs font-semibold text-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-foreground/40 rounded-sm relative">
              <div className="absolute inset-0.5 bg-foreground/60 rounded-[1px]" />
            </div>
          </div>
        </div>
        
        {/* App Content */}
        <div className="h-[calc(932px-3rem-2rem)] overflow-y-auto">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="h-8 bg-background flex items-center justify-center">
          <div className="w-32 h-1.5 bg-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MobileContainer;
