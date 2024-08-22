import { Message } from "../types/Message";
import { quiverRequestSchema } from "./quiverRequestSchema";

export const getRequestId = (message: Message): string => {
  try {
    const json = JSON.parse(String(message.content));
    return quiverRequestSchema.parse(json).id;
  } catch {
    return null;
  }
};
