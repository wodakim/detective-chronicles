import { useGameStore } from "@/lib/store";
import { FolderOpen, Map, MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { currentLocationId, setCurrentLocation, locations } = useGameStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f0f0f0] font-sans flex overflow-hidden">
      {/* Sidebar - Dossier d'enquête */}
      <aside 
        className={`
          ${isSidebarOpen ? 'w-80' : 'w-16'} 
          transition-all duration-300 ease-in-out
          bg-[#262626] border-r border-[#333] flex flex-col z-20
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#333]">
          {isSidebarOpen && <h1 className="font-mono text-xl font-bold tracking-tighter text-[#fbc02d]">DETECTIVE CHRONICLES</h1>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#f0f0f0] hover:bg-[#333]"
          >
            <FolderOpen className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {isSidebarOpen ? (
              <>
                {/* Navigation Rapide */}
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-[#888] mb-3 font-bold">Lieux</h2>
                  <div className="space-y-2">
                    {Object.values(locations).map((loc) => (
                      <Button
                        key={loc.id}
                        variant={currentLocationId === loc.id ? "secondary" : "ghost"}
                        className={`w-full justify-start ${currentLocationId === loc.id ? 'bg-[#fbc02d] text-black hover:bg-[#f9a825]' : 'text-[#ccc] hover:text-white hover:bg-[#333]'}`}
                        onClick={() => setCurrentLocation(loc.id)}
                      >
                        <Map className="mr-2 h-4 w-4" />
                        {loc.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#333]" />

                {/* Outils */}
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-[#888] mb-3 font-bold">Outils</h2>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#444] text-[#ccc] hover:bg-[#333] hover:text-white"
                      onClick={() => setLocation('/interrogation')}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Interrogatoires
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#444] text-[#ccc] hover:bg-[#333] hover:text-white"
                      onClick={() => setLocation('/deduction')}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Tableau de Déduction
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon"><Map className="h-5 w-5" /></Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Lieux</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setLocation('/interrogation')}>
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Interrogatoires</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setLocation('/deduction')}>
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Déduction</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Footer Sidebar */}
        <div className="p-4 border-t border-[#333] bg-[#1f1f1f]">
          {isSidebarOpen && (
            <div className="text-xs text-[#666] font-mono">
              DOSSIER: #8921-B<br/>
              STATUS: OUVERT
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Bar (Optional, for breadcrumbs or status) */}
        <header className="h-14 border-b border-[#333] bg-[#1a1a1a]/90 backdrop-blur flex items-center px-6 justify-between z-10">
           <div className="flex items-center space-x-2 text-sm text-[#888]">
             <span>ENQUÊTE EN COURS</span>
             <span>/</span>
             <span className="text-[#f0f0f0] font-medium">L'ÉCHO SILENCIEUX</span>
           </div>
           <div className="flex items-center space-x-4">
             {/* Accessibility Controls could go here */}
           </div>
        </header>

        {/* Game Viewport */}
        <div className="flex-1 relative overflow-y-auto bg-[#121212]">
          {children}
        </div>
      </main>
    </div>
  );
}
