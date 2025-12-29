import { GameLayout } from "@/components/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSuspects, useGameStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Link as LinkIcon, RotateCcw, Search, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const getRandomPos = (index: number) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return {
    x: col * 250 + 50 + (Math.random() * 40 - 20),
    y: row * 200 + 50 + (Math.random() * 40 - 20),
    rotate: Math.random() * 10 - 5
  };
};

export default function DeductionBoard() {
  const { clues, characters, connections, addConnection, discoverClue, clearConnections } = useGameStore();
  const [_, setLocation] = useLocation();
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; rotate: number }>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'clue' | 'character' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStartId, setConnectionStartId] = useState<string | null>(null);
  const [connectionStartType, setConnectionStartType] = useState<'clue' | 'character' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const discoveredClues = Object.values(clues).filter(c => c.isDiscovered);
  const suspects = getSuspects(characters);

  useEffect(() => {
    const newPositions = { ...positions };
    let hasChanges = false;
    
    discoveredClues.forEach((clue, index) => {
      if (!newPositions[clue.id]) {
        newPositions[clue.id] = getRandomPos(index);
        hasChanges = true;
      }
    });

    suspects.forEach((suspect, index) => {
      if (!newPositions[suspect.id]) {
        newPositions[suspect.id] = getRandomPos(discoveredClues.length + index);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setPositions(newPositions);
    }
  }, [discoveredClues.length, suspects.length]);

  const handleDragEnd = (id: string, info: any) => {
    setPositions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: prev[id].x + info.offset.x,
        y: prev[id].y + info.offset.y
      }
    }));
  };

  const handleItemClick = (id: string, type: 'clue' | 'character') => {
    if (isConnecting) {
      if (connectionStartId === null) {
        setConnectionStartId(id);
        setConnectionStartType(type);
        toast.info("Sélectionnez un deuxième élément pour créer un lien.");
      } else if (connectionStartId === id && connectionStartType === type) {
        setConnectionStartId(null);
        setConnectionStartType(null);
        toast.info("Sélection annulée.");
      } else {
        const success = addConnection(connectionStartId, id, connectionStartType!, type);
        if (success) {
          toast.success("CONNEXION ÉTABLIE ! Une contradiction a été trouvée.");
        } else {
          toast.error("Lien créé. Continuez votre analyse...");
        }
        setConnectionStartId(null);
        setConnectionStartType(null);
        setIsConnecting(false);
      }
    } else {
      setSelectedItemId(id);
      setSelectedItemType(type);
    }
  };

  return (
    <GameLayout>
      <div className="h-full flex flex-col bg-[#111] relative overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 border-b border-[#333] bg-[#1a1a1a] flex items-center justify-between px-6 z-20 shadow-md">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/')} className="text-[#888] hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'enquête
            </Button>
            <div className="h-6 w-px bg-[#333]" />
            <h1 className="font-mono font-bold text-[#f0f0f0]">TABLEAU DE DÉDUCTION</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#666] font-mono hidden md:block">
              {discoveredClues.length} INDICES / {suspects.length} SUSPECTS / {connections.length} LIENS
            </div>
            {connections.length > 0 && (
              <Button
                variant="outline"
                className="border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f]/10"
                onClick={() => {
                  clearConnections();
                  toast.info("Tableau réinitialisé. Recommencez votre analyse.");
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            )}
            <Button 
              variant={isConnecting ? "default" : "outline"}
              className={`
                ${isConnecting 
                  ? 'bg-[#fbc02d] text-black hover:bg-[#f9a825]' 
                  : 'border-[#fbc02d] text-[#fbc02d] hover:bg-[#fbc02d]/10'}
              `}
              onClick={() => {
                setIsConnecting(!isConnecting);
                setConnectionStartId(null);
                setConnectionStartType(null);
              }}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {isConnecting ? 'MODE LIAISON ACTIF' : 'RELIER ÉLÉMENTS'}
            </Button>
          </div>
        </div>

        {/* Board Area */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden bg-[url('/images/investigation_board.jpg')] bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          {/* SVG Layer for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map(conn => {
              const pos1 = positions[conn.clueId1];
              const pos2 = positions[conn.clueId2];
              if (!pos1 || !pos2) return null;
              
              const p1 = { x: pos1.x + 100, y: pos1.y + 60 };
              const p2 = { x: pos2.x + 100, y: pos2.y + 60 };

              return (
                <g key={conn.id}>
                  <line 
                    x1={p1.x} y1={p1.y} 
                    x2={p2.x} y2={p2.y} 
                    stroke={conn.isCorrect ? "#fbc02d" : "#d32f2f"} 
                    strokeWidth="3" 
                    strokeDasharray={conn.isCorrect ? "0" : "5,5"}
                    className="opacity-80"
                  />
                  <circle cx={p1.x} cy={p1.y} r="4" fill={conn.isCorrect ? "#fbc02d" : "#d32f2f"} />
                  <circle cx={p2.x} cy={p2.y} r="4" fill={conn.isCorrect ? "#fbc02d" : "#d32f2f"} />
                </g>
              );
            })}
            
            {isConnecting && connectionStartId && positions[connectionStartId] && (
              <circle 
                cx={positions[connectionStartId].x + 100} 
                cy={positions[connectionStartId].y + 60} 
                r="8" 
                fill="none" 
                stroke="#fbc02d" 
                strokeWidth="2" 
                className="animate-ping"
              />
            )}
          </svg>

          {/* Draggable Clues */}
          <div className="absolute inset-0 z-10">
            {discoveredClues.map((clue) => {
              const pos = positions[clue.id] || { x: 0, y: 0, rotate: 0 };
              const isSelected = connectionStartId === clue.id && connectionStartType === 'clue';
              
              return (
                <motion.div
                  key={clue.id}
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(clue.id, info)}
                  initial={pos}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    rotate: isSelected ? 0 : pos.rotate,
                    scale: isSelected ? 1.05 : 1,
                    zIndex: isSelected ? 50 : 1
                  }}
                  className={`
                    absolute w-[200px] cursor-grab active:cursor-grabbing
                    ${isConnecting ? 'cursor-crosshair' : ''}
                  `}
                  onClick={() => handleItemClick(clue.id, 'clue')}
                >
                  <Card className={`
                    bg-[#f5f5f5] text-black shadow-xl border-0 overflow-hidden
                    ${isSelected ? 'ring-4 ring-[#fbc02d]' : ''}
                    transform transition-shadow duration-200
                  `}>
                    <div className="h-2 bg-[#d32f2f] w-full" />
                    <div className="p-3">
                      <h3 className="font-mono font-bold text-sm leading-tight mb-2 uppercase border-b border-black/10 pb-1">
                        {clue.title}
                      </h3>
                      <p className="text-xs text-gray-700 line-clamp-3 font-serif">
                        {clue.description}
                      </p>
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-sm border border-white/20" />
                  </Card>
                </motion.div>
              );
            })}

            {/* Draggable Suspects */}
            {suspects.map((suspect) => {
              const pos = positions[suspect.id] || { x: 0, y: 0, rotate: 0 };
              const isSelected = connectionStartId === suspect.id && connectionStartType === 'character';
              
              return (
                <motion.div
                  key={suspect.id}
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(suspect.id, info)}
                  initial={pos}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    rotate: isSelected ? 0 : pos.rotate,
                    scale: isSelected ? 1.05 : 1,
                    zIndex: isSelected ? 50 : 1
                  }}
                  className={`
                    absolute w-[200px] cursor-grab active:cursor-grabbing
                    ${isConnecting ? 'cursor-crosshair' : ''}
                  `}
                  onClick={() => handleItemClick(suspect.id, 'character')}
                >
                  <Card className={`
                    bg-[#f0f0f0] text-black shadow-xl border-2 border-[#d32f2f] overflow-hidden
                    ${isSelected ? 'ring-4 ring-[#fbc02d]' : ''}
                    transform transition-shadow duration-200
                  `}>
                    <div className="h-3 bg-gradient-to-r from-[#d32f2f] to-[#8b0000] w-full" />
                    <div className="p-3">
                      <h3 className="font-mono font-bold text-sm leading-tight mb-1 uppercase">
                        {suspect.name}
                      </h3>
                      <p className="text-xs text-[#666] font-bold mb-2 border-b border-black/20 pb-1">
                        {suspect.role}
                      </p>
                      <p className="text-xs text-gray-700 line-clamp-3 font-serif">
                        {suspect.description}
                      </p>
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#d32f2f] shadow-sm border-2 border-white" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItemId} onOpenChange={(open) => !open && setSelectedItemId(null)}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-[#f0f0f0]">
          {selectedItemType === 'clue' && selectedItemId && clues[selectedItemId] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#fbc02d] font-mono">{clues[selectedItemId].title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-[#ccc]">{clues[selectedItemId].description}</p>
                {clues[selectedItemId].content && (
                   <div className="bg-[#f0f0f0] text-black p-3 font-serif text-sm">
                     "{clues[selectedItemId].content}"
                   </div>
                )}
              </div>
            </>
          )}
          {selectedItemType === 'character' && selectedItemId && characters[selectedItemId] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#d32f2f] font-mono">{characters[selectedItemId].name}</DialogTitle>
                <DialogDescription className="text-[#fbc02d]">{characters[selectedItemId].role}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-[#ccc]">{characters[selectedItemId].description}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </GameLayout>
  );
}
