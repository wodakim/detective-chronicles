import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle as DialogTitleComponent } from "@/components/ui/dialog";
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
    history: []
  });
  const [showResponse, setShowResponse] = useState(false);

  const suspects = Object.values(characters).filter(c => c.isSuspect);
  const selectedCharacter = selectedCharacterId ? characters[selectedCharacterId] : null;
  const dialogues = selectedCharacterId ? getDialoguesForCharacter(selectedCharacterId) : [];
  const currentDialogue = dialogueState.currentNodeId
    ? dialogues.find(d => d.id === dialogueState.currentNodeId)
    : null;
  const selectedOptionData = currentDialogue && dialogueState.selectedOption
    ? currentDialogue.options.find(o => o.id === dialogueState.selectedOption)
    : null;

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setDialogueState({ currentNodeId: null, selectedOption: null, history: [] });
    setShowResponse(false);
  };

  const handleStartDialogue = (nodeId: string) => {
    setDialogueState({ ...dialogueState, currentNodeId: nodeId });
    setShowResponse(false);
  };

  const handleSelectOption = (optionId: string) => {
    setDialogueState({ ...dialogueState, selectedOption: optionId });
    setShowResponse(false);
  };

  const handleConfirmOption = () => {
    if (!selectedOptionData || !currentDialogue) return;

    if (selectedOptionData.revealClue) {
      discoverClue(selectedOptionData.revealClue);
      toast.success(t('interrogation.new_clue'));
    }

    if (selectedOptionData.suspicionIncrease && selectedOptionData.suspicionIncrease > 0) {
      toast.info(t('interrogation.suspicion_increase'));
    }

    setShowResponse(true);
  };

  const handleContinue = () => {
    if (!selectedCharacterId || !currentDialogue) return;

    const nextNodeId = dialogues.length > 1 && currentDialogue.id === dialogues[0].id
      ? dialogues[1].id
      : null;

    if (nextNodeId) {
      setDialogueState({
        currentNodeId: nextNodeId,
        selectedOption: null,
        history: [...dialogueState.history, { nodeId: currentDialogue.id, optionId: dialogueState.selectedOption || '' }]
      });
      setShowResponse(false);
    } else {
      setDialogueState({ currentNodeId: null, selectedOption: null, history: [] });
      setShowResponse(false);
      toast.info(t('interrogation.finished'));
    }
  };

  return (
    <GameLayout>
      <div className="min-h-screen bg-[#111] p-6 md:p-12">
        <motion.div
          className="max-w-6xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-mono font-bold text-[#f0f0f0]">{t('interrogation.title')}</h1>
              <p className="text-[#888] font-mono mt-2">{t('interrogation.subtitle')}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-[#888] hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('game.back')}
            </Button>
          </div>

          {/* Main Content */}
          {!selectedCharacterId ? (
            /* Suspect Selection */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suspects.map(suspect => (
                <motion.div
                  key={suspect.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="bg-[#1a1a1a] border-[#333] cursor-pointer hover:border-[#fbc02d] transition-colors"
                    onClick={() => handleSelectCharacter(suspect.id)}
                  >
                    <div className="h-2 bg-gradient-to-r from-[#d32f2f] to-[#8b0000]" />
                    <CardHeader>
                      <CardTitle className="text-[#f0f0f0] text-xl">{t(suspect.name)}</CardTitle>
                      <p className="text-[#fbc02d] text-sm font-mono">{t(suspect.role)}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#ccc] text-sm mb-4">{t(suspect.description)}</p>
                      <Button
                        className="w-full bg-[#333] hover:bg-[#444] text-white"
                        onClick={() => handleSelectCharacter(suspect.id)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {t('interrogation.interrogate')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Interrogation Interface */
            <div className="space-y-6">
              <Card className="bg-[#1a1a1a] border-[#333]">
                <div className="h-1 bg-[#d32f2f]" />
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-[#f0f0f0]">{selectedCharacter ? t(selectedCharacter.name) : ''}</CardTitle>
                    <p className="text-[#888] text-sm font-mono mt-1">{selectedCharacter ? t(selectedCharacter.role) : ''}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleSelectCharacter('')}
                    className="border-[#444] text-[#ccc] hover:bg-[#333]"
                  >
                    {t('interrogation.change_suspect')}
                  </Button>
                </CardHeader>
              </Card>

              {/* Dialogue Selection or Active Dialogue */}
              {!currentDialogue ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dialogues.map(dialogue => (
                    <motion.div
                      key={dialogue.id}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card
                        className="bg-[#0a0a0a] border-[#333] cursor-pointer hover:border-[#fbc02d] transition-colors"
                        onClick={() => handleStartDialogue(dialogue.id)}
                      >
                        <CardContent className="pt-6">
                          <p className="text-[#f0f0f0] font-mono mb-4">{t(dialogue.question)}</p>
                          <Button
                            className="w-full bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                            onClick={() => handleStartDialogue(dialogue.id)}
                          >
                            {t('interrogation.ask_question')}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Active Dialogue */
                <div className="space-y-6">
                  <Card className="bg-[#0a0a0a] border-[#fbc02d]/50">
                    <CardContent className="pt-6">
                      <p className="text-[#fbc02d] font-mono text-sm mb-2">{t('interrogation.question')}</p>
                      <p className="text-[#f0f0f0] text-lg font-serif">{t(currentDialogue.question)}</p>
                    </CardContent>
                  </Card>

                  {/* Options */}
                  {!showResponse ? (
                    <div className="space-y-3">
                      {currentDialogue.options.map(option => (
                        <motion.div key={option.id} whileHover={{ scale: 1.01 }}>
                          <Card
                            className={`bg-[#0a0a0a] border-2 cursor-pointer transition-all ${
                              dialogueState.selectedOption === option.id
                                ? 'border-[#fbc02d] bg-[#fbc02d]/5'
                                : 'border-[#333] hover:border-[#fbc02d]/50'
                            }`}
                            onClick={() => handleSelectOption(option.id)}
                          >
                            <CardContent className="pt-6">
                              <p className="text-[#ccc] font-serif">{t(option.text)}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    /* Response Display */
                    <Card className="bg-[#0a0a0a] border-[#d32f2f]/50">
                      <CardContent className="pt-6">
                        <p className="text-[#d32f2f] font-mono text-sm mb-2">{t('interrogation.response')}</p>
                        <p className="text-[#f0f0f0] text-lg font-serif mb-4">{t(selectedOptionData?.response || '')}</p>
                        {selectedOptionData?.suspicionIncrease && (
                          <div className="bg-[#d32f2f]/10 border border-[#d32f2f]/50 p-3 rounded mb-4">
                            <p className="text-[#d32f2f] text-sm font-mono">
                              {t('interrogation.suspicion_increase')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {!showResponse ? (
                      <Button
                        className="flex-1 bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                        onClick={handleConfirmOption}
                        disabled={!dialogueState.selectedOption}
                      >
                        {t('interrogation.confirm')}
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="flex-1 bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                          onClick={handleContinue}
                        >
                          {t('interrogation.continue')}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#444] text-[#ccc] hover:bg-[#333]"
                          onClick={() => setDialogueState({ currentNodeId: null, selectedOption: null, history: [] })}
                        >
                          {t('interrogation.other_questions')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </GameLayout>
  );
}
