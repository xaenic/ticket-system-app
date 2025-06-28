import { Attachment } from "@/components/Attachment";
import { Button } from "@/components/ui/button";
import type { FileWithId } from "@/utils/formatfile";
import {  X } from "lucide-react";
import React from "react";

export const AttachedFiles = ({
  onChange,
  attachedFiles,
  setAttachedFiles,
  setDeletedFiles,
  from = "View",
}: {
  onChange: (...event: [File[] | null]) => void;
  attachedFiles: FileWithId[] | File [];
  newFiles?: FileWithId[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[] | FileWithId[]>>;
  setDeletedFiles?: React.Dispatch<React.SetStateAction<string[]>>;
  from?: string;
}) => {
  return (
    attachedFiles.length > 0 && (
      <div className="space-y-2">
        {/* <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4> */}
        <div className="space-y-2">
          {attachedFiles.map((file: FileWithId | File , index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <Attachment file={file as FileWithId} />
              <Button
                disabled={from === "View"}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updatedFiles = attachedFiles.filter(
                    (_, i) => i !== index
                  );

                  setAttachedFiles(updatedFiles);
                  const fileId = 'id' in file ? file.id : undefined;
                  if (fileId) {
                    setDeletedFiles?.((prev) => [...prev, fileId.toString()]);
                  }
                  onChange(updatedFiles.length > 0 ? updatedFiles : null);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                {from !== "View" && <X className="w-4 h-4" />}
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
