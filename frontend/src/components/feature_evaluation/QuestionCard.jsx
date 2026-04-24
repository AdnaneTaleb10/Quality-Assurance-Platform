import React from 'react';
import YesNoSelector from './YesNoSelector';
import FileUploadZone from './FileUploadZone';

const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerChange,
  uploadedFile,
  onFileUpload,
  onSaveAndContinue
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm w-full max-w-[600px] mx-auto">

      <h3 className="text-[16px] font-medium text-[#1E293B] mb-6 leading-6">
        {question.text}
      </h3>

      <div className="mb-6">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          YOUR DECLARATION
        </p>
        <YesNoSelector selected={selectedAnswer} onChange={onAnswerChange} />
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          PROOF OF CERTIFICATION
        </p>
        <FileUploadZone uploadedFile={uploadedFile} onFileUpload={onFileUpload} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSaveAndContinue}
          className="bg-[#1E56A0] text-white px-5 py-2.5 rounded-md text-sm font-medium shadow"
        >
          Save and Continue
        </button>
      </div>

    </div>
  );
};

export default QuestionCard;