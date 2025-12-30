import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Settings() {
  const { language, setLanguage, saveGame, loadGame, deleteSave, saves } = useGameStore();
  const [_, setLocation] = useLocation();
  const t = useTranslation(language);

  const handleSaveGame = (slot: number) => {
    saveGame(slot);
    toast.success(t('settings.game_saved'));
  };

  const handleLoadGame = (slot: number) => {
    if (loadGame(slot)) {
      toast.success(t('settings.game_loaded'));
      setLocation('/');
    } else {
      toast.error(t('settings.load_error'));
    }
  };

  const handleDeleteSave = (slot: number) => {
    if (confirm(t('settings.confirm_delete'))) {
      deleteSave(slot);
      toast.success(t('settings.save_deleted'));
    }
  };

  const languages: Array<{ code: 'fr' | 'en' | 'pl'; name: string }> = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' }
  ];

  return (
    <GameLayout>
      <div className="min-h-screen bg-[#111] p-6 md:p-12">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-mono font-bold text-[#f0f0f0]">{t('settings.title')}</h1>
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

          {/* Language Settings */}
          <Card className="bg-[#0a0a0a] border-[#fbc02d]/50">
            <CardHeader>
              <CardTitle className="text-[#f0f0f0]">{t('settings.language')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {languages.map((lang) => (
                  <motion.div key={lang.code} whileHover={{ scale: 1.02 }}>
                    <Button
                      className={`w-full ${
                        language === lang.code
                          ? 'bg-[#fbc02d] text-black hover:bg-[#f9a825]'
                          : 'bg-[#333] text-[#ccc] hover:bg-[#444]'
                      }`}
                      onClick={() => setLanguage(lang.code)}
                    >
                      {lang.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save/Load Game */}
          <Card className="bg-[#0a0a0a] border-[#fbc02d]/50">
            <CardHeader>
              <CardTitle className="text-[#f0f0f0]">{t('settings.save_game')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((slot) => {
                  const save = saves[slot];
                  return (
                    <motion.div key={slot} whileHover={{ scale: 1.01 }}>
                      <Card className="bg-[#1a1a1a] border-[#333] hover:border-[#fbc02d]/50 transition-all">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-[#fbc02d] text-lg font-mono font-bold">{t('settings.save_slot')} {slot}</p>
                              {save ? (
                                <div className="mt-2 space-y-1">
                                  <p className="text-[#f0f0f0] text-sm">
                                    {t('settings.save_time')}: {new Date(save.timestamp).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'pl' ? 'pl-PL' : 'en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  <p className="text-[#888] text-xs">
                                    {Object.values(save.state.clues || {}).filter((c: any) => c.isDiscovered).length} indices découverts
                                  </p>
                                </div>
                              ) : (
                                <p className="text-[#666] text-sm mt-2">{t('settings.no_saves')}</p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                className="flex-1 md:flex-none bg-[#4CAF50] text-white hover:bg-[#45a049] min-w-[140px]"
                                onClick={() => handleSaveGame(slot)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                {t('settings.save_game')}
                              </Button>
                              {save && (
                                <>
                                  <Button
                                    className="flex-1 md:flex-none bg-[#2196F3] text-white hover:bg-[#0b7dda] min-w-[140px]"
                                    onClick={() => handleLoadGame(slot)}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {t('settings.load_game')}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f] hover:text-white"
                                    onClick={() => handleDeleteSave(slot)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </GameLayout>
  );
}
