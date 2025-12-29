import { GameLayout } from "@/components/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGameStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, FileText, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Game() {
  const { currentLocationId, locations, clues, discoverClue, setCurrentLocation } = useGameStore();
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [_, setLocation] = useLocation();

  const currentLocation = currentLocationId ? locations[currentLocationId] : null;

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (!currentLocation) {
    return (
      <GameLayout>
        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-[url('/images/detective_desk_background.jpg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter text-[#f0f0f0] mb-4">
              L'ÉCHO SILENCIEUX
            </h1>
            <p className="text-xl text-[#ccc] leading-relaxed">
              Le pianiste Elias Thorne est mort. La police dit suicide. Sa sœur dit meurtre.
              <br/>
              Vous avez 24 heures pour trouver la vérité dans les notes discordantes de sa vie.
            </p>
            <Button 
              size="lg" 
              className="bg-[#fbc02d] text-black hover:bg-[#f9a825] font-bold text-lg px-8 py-6"
              onClick={() => setCurrentLocation('loc1')}
            >
              OUVRIR LE DOSSIER
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  const locationClues = currentLocation.clues.map(id => clues[id]);

  return (
    <GameLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLocation.id}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.4 }}
          className="min-h-full p-6 md:p-12 flex flex-col gap-8"
        >
          {/* Location Header */}
          <div className="relative rounded-xl overflow-hidden border border-[#333] shadow-2xl bg-[#1a1a1a]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent z-10" />
            <img 
              src={currentLocation.image} 
              alt={currentLocation.name} 
              className="w-full h-64 object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <div className="flex items-center gap-2 text-[#fbc02d] mb-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-bold tracking-widest uppercase">Lieu Actuel</span>
              </div>
              <h2 className="text-4xl font-bold font-mono text-white mb-2">{currentLocation.name}</h2>
              <p className="text-[#ccc] max-w-xl text-lg">{currentLocation.description}</p>
            </div>
          </div>

          {/* Investigation Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Clues List */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#f0f0f0] flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#fbc02d]" />
                  Éléments Observables
                </h3>
                <Badge variant="outline" className="border-[#fbc02d] text-[#fbc02d]">
                  {locationClues.filter(c => c.isDiscovered).length} / {locationClues.length} Trouvés
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locationClues.map((clue) => (
                  <Card 
                    key={clue.id}
                    className={`
                      bg-[#262626] border-[#333] hover:border-[#fbc02d] transition-colors cursor-pointer group
                      ${clue.isDiscovered ? 'opacity-100' : 'opacity-70'}
                    `}
                    onClick={() => {
                      discoverClue(clue.id);
                      setSelectedClueId(clue.id);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-[#f0f0f0] group-hover:text-[#fbc02d] transition-colors flex justify-between items-start">
                        {clue.title}
                        {clue.isDiscovered && <Badge className="bg-[#fbc02d] text-black hover:bg-[#fbc02d]">Analysé</Badge>}
                      </CardTitle>
                      <CardDescription className="text-[#888]">
                        Type: {clue.type.toUpperCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#ccc] line-clamp-2">
                        {clue.isDiscovered ? clue.description : "Cliquez pour examiner cet élément..."}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action / Context Panel */}
            <div className="space-y-6">
              <Card className="bg-[#1f1f1f] border-[#333] h-full">
                <CardHeader>
                  <CardTitle className="text-[#f0f0f0]">Notes d'Enquête</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[#888] italic">
                    "N'oubliez pas de vérifier les détails. Les apparences sont souvent trompeuses dans ce métier."
                  </p>
                  <Separator className="bg-[#333]" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#ccc]">Objectifs :</h4>
                    <ul className="text-sm text-[#888] space-y-2 list-disc pl-4">
                      <li>Examiner tous les indices de la scène.</li>
                      <li>Trouver une contradiction avec la thèse du suicide.</li>
                    </ul>
                  </div>
                  
                  <div className="pt-8">
                    <Button 
                      className="w-full bg-[#333] hover:bg-[#444] text-white justify-between group"
                      onClick={() => setLocation('/deduction')}
                    >
                      Ouvrir le Tableau de Déduction
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Clue Detail Dialog */}
      <Dialog open={!!selectedClueId} onOpenChange={(open) => !open && setSelectedClueId(null)}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-[#f0f0f0] max-w-2xl">
          {selectedClueId && clues[selectedClueId] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-mono text-[#fbc02d] flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  {clues[selectedClueId].title}
                </DialogTitle>
                <DialogDescription className="text-[#888] text-lg">
                  Preuve #{clues[selectedClueId].id.toUpperCase()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="aspect-video bg-black rounded-md overflow-hidden border border-[#333]">
                   {/* Placeholder for clue image if available, else generic icon */}
                   <div className="w-full h-full flex items-center justify-center bg-[#111]">
                     <Search className="h-12 w-12 text-[#333]" />
                   </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#666] uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-[#ccc] leading-relaxed">
                      {clues[selectedClueId].description}
                    </p>
                  </div>
                  {clues[selectedClueId].content && (
                    <div className="bg-[#f0f0f0] text-black p-4 rounded-sm font-serif text-sm shadow-inner relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#ddd]" />
                      "{clues[selectedClueId].content}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setSelectedClueId(null)}
                  className="bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                >
                  Fermer le dossier
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </GameLayout>
  );
}
