import api from "@/utils/api";
import type { FileWithId } from "@/utils/formatfile";
import { DownloadIcon, FileText } from "lucide-react";
import toast from "react-hot-toast";

export const Attachment = ({ file }: { file: FileWithId }) => {
  const handleDownload = async () => {
    if (file.id) {
      await api
        .get(`/attachments/${file.id}/download`, {
          responseType: "blob",
        })
        .then((resp) => {
          const url = window.URL.createObjectURL(resp.data);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name || file.filename || "Attachment-" + file.id;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          if (error.status == 403) {
            toast.error("You are not allowed to download this file.");
          } else {
            toast.error("An error occurred while downloading the file.");
          }
        });
    }
  };
  return (
    <div className="flex items-center gap-3">
      {file.id && (
        <DownloadIcon
          onClick={handleDownload}
          className="cursor-pointer w-5 h-5 text-blue-500 "
        />
      )}
      <FileText className="w-5 h-5 text-gray-500" />
      <div>
        <p className="text-sm font-medium text-gray-700">
          {file.name || file.filename}
        </p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};
