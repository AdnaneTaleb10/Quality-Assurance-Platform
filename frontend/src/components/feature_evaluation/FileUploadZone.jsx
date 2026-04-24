import React, { useRef } from 'react';

const FileUploadZone = ({ uploadedFile, onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) onFileUpload(e.target.files[0]);
  };

  return (
    <div
      onClick={() => !uploadedFile && fileInputRef.current.click()}
      className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 cursor-pointer"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadedFile ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-green-600">{uploadedFile.name}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileUpload(null);
            }}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove file
          </button>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 mx-auto mb-3 bg-[#A1D2ED] rounded-lg flex items-center justify-center">
            <img src="/upload_file.png"className="w-4 h-4 brightness-0" />
          </div>

          <p className="text-sm text-gray-600">
            Drop safety certificate here
          </p>

          <p className="text-xs text-gray-400 mt-1">
            PDF or JPEG (Max 10MB)
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploadZone;