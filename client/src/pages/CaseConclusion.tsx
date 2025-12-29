import { GameLayout } from "@/components/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function CaseConclusion() {
  const { caseAnalysis, analyzeCase, characters, connections, language } = useGameStore();
  const t = useTranslation(language);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!caseAnalysis) {
      analyzeCase();
    }
  }, []);

  if (!caseAnalysis) {
    return null;
  }

  const culprit = caseAnalysis.culpritId ? characters[caseAnalysis.culpritId] : null;

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <GameLayout>
      <div className="min-h-screen bg-[#111] p-6 md:p-12 flex flex-col items-center justify-center">
        <motion.div
          className="w-full max-w-4xl space-y-8"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Verdict Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              {caseAnalysis.solved ? (
                <CheckCircle className="h-16 w-16 text-[#fbc02d] animate-pulse" />
              ) : caseAnalysis.totalConnections === 0 ? (
                <AlertCircle className="h-16 w-16 text-[#888]" />
              ) : (
                <XCircle className="h-16 w-16 text-[#d32f2f]" />
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-mono font-bold text-[#f0f0f0] tracking-tighter">
              {t(caseAnalysis.verdict)}
            </h1>
            <p className="text-lg text-[#888] font-mono">
              {t('conclusion.correct_connections')} : {caseAnalysis.correctConnections} / {caseAnalysis.totalConnections}
            </p>
          </motion.div>

          {/* Main Analysis Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-[#1a1a1a] border-[#333] overflow-hidden">
              <div className={`h-1 w-full ${caseAnalysis.solved ? 'bg-[#fbc02d]' : 'bg-[#d32f2f]'}`} />
              <CardHeader>
                <CardTitle className="text-[#f0f0f0] text-2xl">{t('conclusion.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-[#0a0a0a] p-6 rounded-lg border border-[#333]">
                  <p className="text-[#ccc] leading-relaxed text-lg font-serif">
                    {t(caseAnalysis.explanation, { count: caseAnalysis.totalConnections })}
                  </p>
                </div>

                {/* Culprit Profile if Solved */}
                {caseAnalysis.solved && culprit && (
                  <div className="bg-gradient-to-r from-[#d32f2f]/20 to-transparent p-6 rounded-lg border border-[#d32f2f]/50">
                    <h3 className="text-[#d32f2f] font-bold text-xl mb-3 uppercase">{t('conclusion.culprit')}</h3>
                    <div className="space-y-2">
                      <p className="text-[#f0f0f0]">
                        <span className="font-bold">{t('notebook.title_label')} :</span> {t(culprit.name)}
                      </p>
                      <p className="text-[#f0f0f0]">
                        <span className="font-bold">Rôle :</span> {t(culprit.role)}
                      </p>
                      <p className="text-[#ccc] mt-3">
                        {t(culprit.description)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Key Connections */}
                {connections.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[#fbc02d] font-bold uppercase">{t('conclusion.connections_made')}</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {connections.map(conn => (
                        <div
                          key={conn.id}
                          className={`p-3 rounded border-l-4 ${
                            conn.isCorrect
                              ? 'bg-[#fbc02d]/10 border-[#fbc02d]'
                              : 'bg-[#d32f2f]/10 border-[#d32f2f]'
                          }`}
                        >
                          <p className="text-sm text-[#ccc]">
                            <span className={conn.isCorrect ? 'text-[#fbc02d]' : 'text-[#d32f2f]'}>
                              {conn.clueId1} ↔ {conn.clueId2}
                            </span>
                          </p>
                          <p className="text-xs text-[#888] mt-1">{t(conn.reason)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Educational Section */}
                <div className="bg-[#0a0a0a] p-6 rounded-lg border border-[#333]">
                  <h4 className="text-[#fbc02d] font-bold uppercase mb-3">{t('conclusion.lessons_title')}</h4>
                  <ul className="space-y-2 text-sm text-[#ccc]">
                    <li className="flex gap-2">
                      <span className="text-[#fbc02d]">•</span>
                      <span>{t('conclusion.lesson1')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#fbc02d]">•</span>
                      <span>{t('conclusion.lesson2')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#fbc02d]">•</span>
                      <span>{t('conclusion.lesson3')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#fbc02d]">•</span>
                      <span>{t('conclusion.lesson4')}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => setLocation('/deduction')}
              className="bg-[#333] hover:bg-[#444] text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('conclusion.back_to_board')}
            </Button>
            <Button
              onClick={() => setLocation('/')}
              className="bg-[#fbc02d] text-black hover:bg-[#f9a825]"
            >
              {t('conclusion.restart')}
            </Button>
          </motion.div>

          {/* Stats Footer */}
          <motion.div variants={itemVariants} className="text-center text-xs text-[#666] font-mono space-y-1">
            <p>Dossier: #8921-B | Enquêteur: Vous</p>
            <p>Statut: {caseAnalysis.solved ? t('conclusion.solved') : t('conclusion.incomplete')}</p>
          </motion.div>
        </motion.div>
      </div>
    </GameLayout>
  );
}
