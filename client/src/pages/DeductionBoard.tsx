import { GameLayout } from "@/components/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSuspects, useGameStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
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
  const { clues, characters, connections, addConnection, discoverClue, clearConnections, language } = useGameStore();
  const t = useTranslation(language);
  const [_, setLocation] = useLocation();
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; rotate: number }>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'clue' | 'character' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStartId, setConnectionStartId] = useState<string | null>(null);
  const [connectionStartType, setConnectionStartType] = useState<'clue' | 'character' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const discoveredClues = Object.values(clues).filter(c => c.isDiscovered);
  const suspects = getSuspects(characters);

  useEffect(() => {
    const newPositions = { ...positions };
    let hasChanges = false;
    
    discoveredClues.forEach((clue, index) => {
      if (clue && clue.id && !newPositions[clue.id]) {
        newPositions[clue.id] = getRandomPos(index);
        hasChanges = true;
      }
    });

    suspects.forEach((suspect, index) => {
      if (suspect && suspect.id && !newPositions[suspect.id]) {
        newPositions[suspect.id] = getRandomPos(discoveredClues.length + index);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setPositions(newPositions);
    }
  }, [discoveredClues.length, suspects.length]);

  const handleDragEnd = (id: string, info: any) => {
    if (!id || !info || !info.offset) return;
    
    setPositions(prev => {
      if (!prev[id]) return prev;
      
      return {
        ...prev,
        [id]: {
          ...prev[id],
          x: prev[id].x + (info.offset.x || 0),
          y: prev[id].y + (info.offset.y || 0)
        }
      };
    });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleItemClick = (id: string, type: 'clue' | 'character') => {
    if (!id || !type) return;
    
    if (isConnecting) {
      if (connectionStartId === null) {
        setConnectionStartId(id);
        setConnectionStartType(type);
        toast.info(t('deduction.select_second'));
      } else if (connectionStartId === id && connectionStartType === type) {
        setConnectionStartId(null);
        setConnectionStartType(null);
        toast.info(t('deduction.selection_cancelled'));
      } else {
        try {
          const success = addConnection(connectionStartId, id, connectionStartType!, type);
          if (success) {
            toast.success(t('deduction.relevant_connection'));
          } else {
            toast.error(t('deduction.potential_connection'));
          }
        } catch (error) {
          console.error('Erreur lors de la création de la connexion:', error);
          toast.error('Impossible de créer cette connexion');
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
              {t('game.back')}
            </Button>
            <div className="h-6 w-px bg-[#333]" />
            <h1 className="font-mono font-bold text-[#f0f0f0]">{t('deduction.title')}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#666] font-mono hidden md:block">
              {discoveredClues.length} {t('deduction.clues')} / {suspects.length} {t('deduction.suspects')} / {connections.length} {t('deduction.connections')}
            </div>
            <div className="h-6 w-px bg-[#333] hidden md:block" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#333] text-[#888] hover:text-white h-8 w-8 p-0"
                onClick={handleZoomOut}
                title="Zoom arrière"
              >
                -
              </Button>
              <span className="text-xs text-[#666] font-mono min-w-[45px] text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                className="border-[#333] text-[#888] hover:text-white h-8 w-8 p-0"
                onClick={handleZoomIn}
                title="Zoom avant"
              >
                +
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#333] text-[#888] hover:text-white h-8 px-2"
                onClick={handleResetView}
                title="Réinitialiser la vue"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            {connections.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f]/10"
                  onClick={() => {
                    clearConnections();
                    toast.info(t('deduction.reset_message'));
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('deduction.reset')}
                </Button>
                <Button
                  className="bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                  onClick={() => setLocation('/conclusion')}
                >
                  {t('deduction.conclude')}
                </Button>
              </div>
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
              {isConnecting ? t('deduction.mode_link_active') : t('deduction.mode_link')}
            </Button>
          </div>
        </div>

        {/* Board Area */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden bg-[url('/images/investigation_board.jpg')] bg-cover bg-center cursor-move"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          {/* SVG Layer for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
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
            </g>
          </svg>

          {/* Draggable Clues */}
          <div 
            className="absolute inset-0 z-10 transition-transform duration-200"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          >
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
                        {t(clue.title)}
                      </h3>
                      <p className="text-xs text-gray-700 line-clamp-3 font-serif">
                        {t(clue.description)}
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
                        {t(suspect.name)}
                      </h3>
                      <p className="text-[10px] text-[#d32f2f] font-bold mb-2 uppercase tracking-tighter">
                        {t(suspect.role)}
                      </p>
                      <div className="aspect-square bg-gray-300 mb-2 overflow-hidden grayscale">
                        <img src={suspect.image} alt={t(suspect.name)} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
