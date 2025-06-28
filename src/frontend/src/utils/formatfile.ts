import type { Attachment } from "@/interfaces/ITicket";

export interface FileWithId extends File {
  id?: number;
  filename: string;
}
export const attachmentToFile = (attachment: Attachment): FileWithId => {
  const file = {
    name: attachment.filename,
    filename:attachment.filename,
    size: attachment.size,
    id: attachment.id,
  };

  return file as FileWithId;
};
