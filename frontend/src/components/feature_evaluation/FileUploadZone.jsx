// components/feature_evaluation/FileUploadZone.jsx
import { useRef } from "react";
import { Upload, File, CheckCircle2 } from "lucide-react";

/**
 * proof_slots: [{ slot_order: number, title: string }]
 * uploadedFiles: { [slotOrder]: File }
 * onFileUpload: (slotOrder, File) => void
 */
export default function FileUploadZone({ proofSlots = [], uploadedFiles = {}, onFileUpload }) {
  const fileInputRefs = useRef({});

  if (proofSlots.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {proofSlots.map(({ slot_order, title }) => {
        const file = uploadedFiles?.[slot_order];

        return (
          <div
            key={slot_order}
            onClick={() => fileInputRefs.current[slot_order]?.click()}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
              file
                ? "bg-green-50 border-green-200 hover:bg-green-100"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            {/* Slot number badge */}
            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              file ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {file ? <CheckCircle2 className="w-3.5 h-3.5" /> : slot_order}
            </span>

            {/* Title + file name */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-snug ${file ? "text-green-800" : "text-gray-700"}`}>
                {title}
              </p>
              {file ? (
                <p className="text-[11px] text-green-600 mt-0.5 truncate flex items-center gap-1">
                  <File className="w-3 h-3 shrink-0" />
                  {file.name}
                </p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-0.5">Click to upload — PDF or PNG</p>
              )}
            </div>

            {/* Upload icon */}
            {!file && <Upload className="w-4 h-4 text-gray-400 shrink-0" />}

            {/* Hidden input */}
            <input
              ref={(el) => (fileInputRefs.current[slot_order] = el)}
              type="file"
              accept=".png,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) onFileUpload(slot_order, e.target.files[0]);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}