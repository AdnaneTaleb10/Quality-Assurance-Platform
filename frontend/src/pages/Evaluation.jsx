import React, { useState } from 'react';
import QuestionCard from '../components/feature_evaluation/QuestionCard';
import Sidebar from '../components/feature_evaluation/Evaluation_sidebar';
import Topbar from '../components/Topbar';

const EvaluationPage = () => {

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // ✅ IMPORTANT FIX
  const [uploadedFile, setUploadedFile] = useState({});

  const handleFileUpload = (key, file) => {
    setUploadedFile(prev => ({
      ...prev,
      [key]: file
    }));
  };

  const currentQuestion = {
    id: "q1",
    text: "Are all automated water suppression systems certified?",
    section: 1,
    totalSections: 12
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] font-sans">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-y-auto pt-8 items-center">

          {/* HEADER */}
          <div className="w-full max-w-[720px] mb-8 px-2">
            <div className="flex justify-between items-start w-full">

              <h2 className="text-[28px] font-bold text-[#1E293B]">
                Infrastructure Safety
              </h2>

            </div>
          </div>

          {/* CARD */}
          <div className="w-full max-w-[720px] px-2">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerChange={setSelectedAnswer}
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              onSaveAndContinue={() => {}}
            />
          </div>

        </main>
      </div>
    </div>
  );
};

export default EvaluationPage;