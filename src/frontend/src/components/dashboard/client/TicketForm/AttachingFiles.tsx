import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import React from "react";

export const AttachingFiles = ({
  setAttachedFiles,
  onChange,

  attachedFiles,
}: {
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onChange: (files: File[]) => void;
 
  attachedFiles: File[];
}) => {
  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg h-40 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer relative">
      <Input
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            const newFiles = Array.from(files);
            const updatedFiles = [...attachedFiles, ...newFiles];
            setAttachedFiles(updatedFiles);
            
            onChange(updatedFiles);
          }
        }}
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <Paperclip className="self-center " />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            <span className="text-blue-600 underline">Upload files</span> or
            drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, PDF up to 10MB each
          </p>
        </div>
      </div>
    </div>
  );
};
