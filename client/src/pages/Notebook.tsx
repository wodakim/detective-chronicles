import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGameStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Notebook() {
  const { notes, addNote, updateNote, deleteNote, clues, language } = useGameStore();
  const t = useTranslation(language);
  const [_, setLocation] = useLocation();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const selectedNote = selectedNoteId ? notes[selectedNoteId] : null;
  const notesList = Object.values(notes).sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreateNote = () => {
    if (!formData.title.trim()) {
      toast.error(t('notebook.title_empty'));
      return;
    }
    addNote(formData.title, formData.content);
    setFormData({ title: '', content: '' });
    setIsCreating(false);
    toast.success(t('notebook.note_created'));
  };

  const handleUpdateNote = () => {
    if (!selectedNote) return;
    if (!formData.title.trim()) {
      toast.error(t('notebook.title_empty'));
      return;
    }
    updateNote(selectedNote.id, formData.title, formData.content);
    toast.success(t('notebook.note_updated'));
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setFormData({ title: '', content: '' });
    }
    toast.success(t('notebook.note_deleted'));
  };

  const handleSelectNote = (id: string) => {
    const note = notes[id];
    if (note) {
      setSelectedNoteId(id);
      setFormData({ title: note.title, content: note.content });
      setIsCreating(false);
    }
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setSelectedNoteId(null);
    setFormData({ title: '', content: '' });
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
              <h1 className="text-4xl font-mono font-bold text-[#f0f0f0]">{t('notebook.title')}</h1>
              <p className="text-[#888] font-mono mt-2">{t('notebook.subtitle')}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="space-y-4">
              <Button
                className="w-full bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                onClick={handleNewNote}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('notebook.new_note')}
              </Button>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {notesList.length === 0 ? (
                  <Card className="bg-[#0a0a0a] border-[#333]">
                    <CardContent className="pt-6">
                      <p className="text-[#888] text-center text-sm">{t('notebook.no_notes')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  notesList.map((note) => (
                    <motion.div
                      key={note.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectNote(note.id)}
                    >
                      <Card
                        className={`bg-[#0a0a0a] border-2 cursor-pointer transition-all ${
                          selectedNoteId === note.id
                            ? 'border-[#fbc02d] bg-[#fbc02d]/5'
                            : 'border-[#333] hover:border-[#fbc02d]/50'
                        }`}
                      >
                        <CardContent className="pt-4">
                          <p className="text-[#f0f0f0] font-mono text-sm truncate">{note.title}</p>
                          <p className="text-[#888] text-xs mt-1">
                            {new Date(note.updatedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'pl' ? 'pl-PL' : 'en-US')}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Note Editor */}
            <div className="md:col-span-2">
              {isCreating || selectedNote ? (
                <Card className="bg-[#0a0a0a] border-[#fbc02d]/50">
                  <CardHeader>
                    <CardTitle className="text-[#f0f0f0]">
                      {isCreating ? t('notebook.new_note') : t('notebook.edit_note')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-[#888] text-sm font-mono mb-2 block">{t('notebook.title_label')}</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={t('notebook.title_placeholder')}
                        className="bg-[#1a1a1a] border-[#333] text-[#f0f0f0] placeholder-[#666]"
                      />
                    </div>

                    <div>
                      <label className="text-[#888] text-sm font-mono mb-2 block">{t('notebook.content_label')}</label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder={t('notebook.content_placeholder')}
                        className="bg-[#1a1a1a] border-[#333] text-[#f0f0f0] placeholder-[#666] min-h-[300px] resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      {isCreating ? (
                        <>
                          <Button
                            className="flex-1 bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                            onClick={handleCreateNote}
                          >
                            {t('notebook.create')}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-[#444] text-[#ccc] hover:bg-[#333]"
                            onClick={() => {
                              setIsCreating(false);
                              setFormData({ title: '', content: '' });
                            }}
                          >
                            {t('notebook.cancel')}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="flex-1 bg-[#fbc02d] text-black hover:bg-[#f9a825]"
                            onClick={handleUpdateNote}
                          >
                            {t('notebook.update')}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-[#d32f2f] text-[#d32f2f] hover:bg-[#d32f2f]/10"
                            onClick={() => {
                              if (selectedNote) {
                                handleDeleteNote(selectedNote.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('notebook.delete')}
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-[#0a0a0a] border-[#333] h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <p className="text-[#888] font-mono">{t('notebook.select_note')}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </GameLayout>
  );
}
