import React, { useRef } from 'react';
import { Upload, File } from 'lucide-react';

const FileUploadZone = ({ documents, uploadedFile, onFileUpload }) => {
  const fileInputRefs = useRef({});

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3">

      {documents.map((doc) => {
        const file = uploadedFile?.[doc.key];

        return (
          <div
            key={doc.key}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => fileInputRefs.current[doc.key]?.click()}
          >

            {/* TEXT */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">{doc.label}</span>

              {file ? (
                <span className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                  <File className="w-3 h-3" />
                  {file.name}
                </span>
              ) : (
                <span className="text-[10px] text-gray-400 mt-1">
                  PNG or PDF only
                </span>
              )}
            </div>

            {/* ICON */}
            {file ? (
              <File className="w-4 h-4 text-green-600" />
            ) : (
              <Upload className="w-4 h-4 text-gray-500" />
            )}

            {/* INPUT */}
            <input
              ref={(el) => (fileInputRefs.current[doc.key] = el)}
              type="file"
              accept=".png,.pdf"
              className="hidden"
              onChange={(e) =>
                onFileUpload(doc.key, e.target.files[0])
              }
            />
          </div>
        );
      })}

    </div>
  );
};

export default FileUploadZone;