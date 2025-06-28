import { Button } from "@/components/ui/button";
import type { FileWithId } from "@/utils/formatfile";
import { FileText, X } from "lucide-react";
import React from "react";

export const NewAttachedFiles = ({
  newFiles,
  setNewFiles,
}: {
  newFiles: File[];
  setNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  from?: string;
}) => {
  return (
    newFiles.length > 0 && (
      <div className="space-y-2">
        {/* <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4> */}
        <div className="space-y-2">
          {newFiles.map((file: FileWithId | File, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updatedNewFiles = newFiles?.filter(
                    (_, i) => i !== index
                  );
                  setNewFiles(updatedNewFiles);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
