import React, { useState } from 'react';
import QuestionCard from '../components/feature_evaluation/QuestionCard';
import Sidebar from '../components/feature_evaluation/Evaluation_sidebar'; 
import Topbar from '../components/Topbar';

const EvaluationPage = () => {
  // État local uniquement pour l'affichage immédiat
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Donnée statique pour le rendu UI
  const currentQuestion = { 
    id: "q1", 
    text: "Are all automated water suppression systems certified?", 
    section: 1, 
    totalSections: 12 
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] font-sans">
      
      {/* Topbar */}
      <Topbar />

      {/* Conteneur Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto pt-8 items-center">
          
          {/* Title + Progress */}
          <div className="w-full max-w-[720px] flex justify-between items-center mb-5 px-2 ml-[-25px]">
            <h2 className="text-[28px] font-bold text-[#1E293B]">
              Infrastructure Safety
            </h2>

            <div className="flex flex-col items-end gap-1.5">
                {/* Texte Section mis en gras */}
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Section {currentQuestion.section} of {currentQuestion.totalSections}
                </span>

                {/* Barre de progression agrandie (h-[6px]) */}
                <div className="w-40 h-[6px] bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[8%] h-full bg-[#2563EB] rounded-full"></div>
                </div>
            </div>
          </div>

          {/* Card */}
          <div className="w-full max-w-[720px] px-2">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerChange={setSelectedAnswer}
              uploadedFile={uploadedFile}
              onFileUpload={setUploadedFile}
              onSaveAndContinue={() => {}}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvaluationPage;