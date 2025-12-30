import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDialoguesForCharacter, useGameStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface DialogueState {
  currentNodeId: string | null;
  selectedOption: string | null;
  history: Array<{ nodeId: string; optionId: string }>;
}

export default function Interrogation() {
  const { characters, discoverClue, language } = useGameStore();
  const t = useTranslation(language);
  const [_, setLocation] = useLocation();

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [dialogueState, setDialogueState] = useState<DialogueState>({
    currentNodeId: null,
    selectedOption: null,
    history: [],
  });
  const [showResponse, setShowResponse] = useState(false);

  const suspects = Object.values(characters).filter((c) => c.isSuspect);
  const selectedCharacter = selectedCharacterId ? characters[selectedCharacterId] : null;
  const dialogues = selectedCharacterId ? getDialoguesForCharacter(selectedCharacterId) : [];

  const currentDialogue = dialogueState.currentNodeId
    ? dialogues.find((d) => d.id === dialogueState.currentNodeId)
    : null;

  const selectedOptionData =
    currentDialogue && dialogueState.selectedOption
      ? currentDialogue.options.find((o) => o.id === dialogueState.selectedOption)
      : null;

  const resetDialogue = () => {
    setDialogueState({ currentNodeId: null, selectedOption: null, history: [] });
    setShowResponse(false);
  };

  const handleSelectCharacter = (characterId: string | null) => {
    setSelectedCharacterId(characterId);
    resetDialogue();
  };

  const handleStartDialogue = (nodeId: string) => {
    setDialogueState((prev) => ({ ...prev, currentNodeId: nodeId, selectedOption: null }));
    setShowResponse(false);
  };

  const handleSelectOption = (optionId: string) => {
    setDialogueState((prev) => ({ ...prev, selectedOption: optionId }));
  };

  const handleConfirmOption = () => {
    if (!selectedOptionData || !currentDialogue) return;

    // Révéler un indice
    if (selectedOptionData.revealClue) {
      discoverClue(selectedOptionData.revealClue);
      toast.success(t("interrogation.new_clue"));
    }

    // Augmentation de suspicion (si implémenté plus tard dans le store)
    if (selectedOptionData.suspicionIncrease && selectedOptionData.suspicionIncrease > 0) {
      toast.info(t("interrogation.suspicion_increase"));
    }

    setShowResponse(true);
  };

  const handleContinue = () => {
    if (!selectedOptionData || !currentDialogue) return;

    // Priorité au nextNodeId défini dans l'option choisie
    const nextNodeId = selectedOptionData.nextNodeId
      ? selectedOptionData.nextNodeId
      : null;

    if (nextNodeId && dialogues.some((d) => d.id === nextNodeId)) {
      setDialogueState({
        currentNodeId: nextNodeId,
        selectedOption: null,
        history: [...dialogueState.history, { nodeId: currentDialogue.id, optionId: dialogueState.selectedOption! }],
      });
      setShowResponse(false);
    } else {
      // Fin de l'interrogation pour ce personnage
      resetDialogue();
      handleSelectCharacter(null); // Retour à la sélection des suspects
      toast.success(t("interrogation.finished"));
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <GameLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-[#111] p-6 md:p-12"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-mono font-bold text-[#f0f0f0]">{t("interrogation.title")}</h1>
              <p className="text-[#888] font-mono mt-2">{t("interrogation.subtitle")}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-[#888] hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("game.back")}
            </Button>
          </div>

          {/* Sélection des suspects */}
          {!selectedCharacterId ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suspects.map((suspect) => (
                <motion.div
                  key={suspect.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="bg-[#1a1a1a] border-[#333] cursor-pointer hover:border-[#fbc02d] transition-all"
                    onClick={() => handleSelectCharacter(suspect.id)}
                  >
                    <div className="h-2 bg-gradient-to-r from-[#d32f2f] to-[#8b0000]" />
                    <CardHeader>
                      <CardTitle className="text-[#f0f0f0] text-xl">{t(suspect.name)}</CardTitle>
                      <p className="text-[#fbc02d] text-sm font-mono">{t(suspect.role)}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square mb-4 bg-[#111] rounded overflow-hidden">
                        <img
                          src={suspect.image}
                          alt={t(suspect.name)}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                        />
                      </div>
                      <p className="text-[#ccc] text-sm mb-6">{t(suspect.description)}</p>
                      <Button
                        className="w-full bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                        onClick={() => handleSelectCharacter(suspect.id)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {t("interrogation.interrogate")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Interface d'interrogation */
            <div className="space-y-8">
              {/* En-tête du personnage */}
              <Card className="bg-[#1a1a1a] border-[#333]">
                <div className="h-1 bg-[#d32f2f]" />
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#f0f0f0] text-2xl">
                      {selectedCharacter ? t(selectedCharacter.name) : ""}
                    </CardTitle>
                    <p className="text-[#888] text-sm font-mono mt-1">
                      {selectedCharacter ? t(selectedCharacter.role) : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleSelectCharacter(null)}
                    className="border-[#444] text-[#ccc] hover:bg-[#333]"
                  >
                    {t("interrogation.change_suspect")}
                  </Button>
                </CardHeader>
              </Card>

              {/* Liste des questions disponibles */}
              {!currentDialogue ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dialogues.map((dialogue) => (
                    <motion.div
                      key={dialogue.id}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Card
                        className="bg-[#0a0a0a] border-[#333] cursor-pointer hover:border-[#fbc02d] transition-all"
                        onClick={() => handleStartDialogue(dialogue.id)}
                      >
                        <CardContent className="pt-8">
                          <p className="text-[#f0f0f0] font-mono text-lg leading-relaxed">
                            {t(dialogue.question)}
                          </p>
                          <Button
                            className="mt-6 w-full bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                            onClick={() => handleStartDialogue(dialogue.id)}
                          >
                            {t("interrogation.ask_question")}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Dialogue actif */
                <div className="space-y-8">
                  {/* Question posée */}
                  <Card className="bg-[#0a0a0a] border-[#fbc02d]/50">
                    <CardContent className="pt-8">
                      <p className="text-[#fbc02d] font-mono text-sm mb-3">{t("interrogation.question")}</p>
                      <p className="text-[#f0f0f0] text-xl font-serif leading-relaxed">
                        {t(currentDialogue.question)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Choix des réponses */}
                  {!showResponse ? (
                    <div className="space-y-4">
                      {currentDialogue.options.map((option) => (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card
                            className={`bg-[#0a0a0a] border-2 cursor-pointer transition-all ${
                              dialogueState.selectedOption === option.id
                                ? "border-[#fbc02d] bg-[#fbc02d]/10"
                                : "border-[#333] hover:border-[#fbc02d]/60"
                            }`}
                            onClick={() => handleSelectOption(option.id)}
                          >
                            <CardContent className="pt-6">
                              <p className="text-[#ddd] font-serif text-lg">
                                {t(option.text)}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    /* Réponse du personnage */
                    <Card className="bg-[#0a0a0a] border-[#d32f2f]/50">
                      <CardContent className="pt-8">
                        <p className="text-[#d32f2f] font-mono text-sm mb-4">{t("interrogation.response")}</p>
                        <p className="text-[#f0f0f0] text-xl font-serif leading-relaxed mb-6">
                          {t(selectedOptionData?.response || "")}
                        </p>
                        {selectedOptionData?.revealClue && (
                          <div className="bg-[#fbc02d]/10 border border-[#fbc02d] p-4 rounded">
                            <p className="text-[#fbc02d] font-mono">
                              {t("interrogation.new_clue_discovered")}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex gap-4">
                    {!showResponse ? (
                      <Button
                        className="flex-1 bg-[#fbc02d] text-black hover:bg-[#f9a825] disabled:opacity-50"
                        onClick={handleConfirmOption}
                        disabled={!dialogueState.selectedOption}
                      >
                        {t("interrogation.confirm")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="flex-1 bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                          onClick={handleContinue}
                        >
                          {selectedOptionData?.nextNodeId ? t("interrogation.continue") : t("interrogation.end_interrogation")}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#444] text-[#ccc] hover:bg-[#333]"
                          onClick={resetDialogue}
                        >
                          {t("interrogation.other_questions")}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </GameLayout>
  );
}
