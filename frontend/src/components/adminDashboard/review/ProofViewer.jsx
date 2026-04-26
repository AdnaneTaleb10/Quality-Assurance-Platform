import { useState } from "react";
import {
  Paperclip,
  ImageIcon,
  FileText,
  Download,
  X,
  ExternalLink,
} from "lucide-react";

function humanSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProofViewer({ proof }) {
  const [zoom, setZoom] = useState(false);

  if (!proof || !proof.url) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-lg px-3 py-2">
        <Paperclip className="w-3.5 h-3.5" />
        No proof attached
      </div>
    );
  }

  const isImage = (proof.mime_type ?? "").startsWith("image/");
  const isPdf = proof.mime_type === "application/pdf";

  return (
    <>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 min-w-0">
            {isImage ? (
              <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="text-xs font-medium text-gray-700 truncate">
              {proof.file_name ?? "Proof"}
            </span>
            {proof.size_bytes != null && (
              <span className="text-[10px] text-gray-400 shrink-0">
                {humanSize(proof.size_bytes)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={proof.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-blue-700 px-2 py-1 rounded-md hover:bg-white transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
            <a
              href={proof.url}
              download={proof.file_name}
              className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-blue-700 px-2 py-1 rounded-md hover:bg-white transition-colors"
              title="Download"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          </div>
        </div>

        {/* Body */}
        <div className="p-3">
          {isImage && (
            <button
              type="button"
              onClick={() => setZoom(true)}
              className="block group"
            >
              <img
                src={proof.url}
                alt={proof.file_name ?? "proof"}
                className="max-h-64 rounded-lg border border-gray-100 object-contain bg-gray-50 group-hover:opacity-90 transition-opacity"
              />
              <span className="block text-[10px] text-gray-400 mt-1">
                Click to zoom
              </span>
            </button>
          )}

          {isPdf && (
            <iframe
              src={proof.url}
              title={proof.file_name ?? "proof.pdf"}
              className="w-full h-72 rounded-lg border border-gray-100 bg-gray-50"
            />
          )}

          {!isImage && !isPdf && (
            <div className="flex items-center gap-3 px-3 py-4 rounded-lg bg-gray-50 border border-gray-100">
              <FileText className="w-6 h-6 text-gray-400" />
              <div className="text-xs text-gray-600">
                Preview not available for this file type. Use{" "}
                <span className="font-medium">Open</span> or{" "}
                <span className="font-medium">Download</span> to inspect it.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image lightbox */}
      {zoom && isImage && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
        >
          <button
            onClick={() => setZoom(false)}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={proof.url}
            alt={proof.file_name ?? "proof"}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}