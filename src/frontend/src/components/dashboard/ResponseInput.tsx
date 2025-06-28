import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Paperclip, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { addResponse } from "@/services/ticket.response.service";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const ResponseInput = () => {
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const queryClient = useQueryClient();
  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "" && selectedFiles.length == 0) {
      return toast.error("You can't send an empty response");
    }
    setLoading(true);
    try {
      await addResponse({
        message,
        attachments: selectedFiles,
        ticket_id: id || "",
      });
      queryClient.invalidateQueries({
        queryKey: ["ticket", id],
        exact: false,
      });
      setMessage("");
      setSelectedFiles([]);
    } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else if (error instanceof Object) {
            toast.error(error['message']);
          } else toast.error("Something went wrong");
        }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} className="border-t pt-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full min-h-[80px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm"
            >
              <span className="text-gray-700 truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <small className="text-gray-500 text-xs">
          Add a message to continue the conversation
        </small>

        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <span
            onClick={triggerFileInput}
            className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Attach files"
          >
            <Paperclip size={20} />
          </span>

          <Button
            disabled={loading }
            type="submit"
            className="px-4 py-2 hover:bg-blue-400 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add a Response
          </Button>
        </div>
      </div>
    </form>
  );
};
