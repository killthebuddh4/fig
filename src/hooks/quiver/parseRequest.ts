import { Message } from "../../types/Message";
import { QuiverRequest } from "../../types/QuiverRequest";
import { Maybe } from "../../types/Maybe";
import { quiverRequestSchema } from "./quiverRequestSchema";

export const parseRequest = (message: Message): Maybe<QuiverRequest> => {
  let json;
  try {
    json = JSON.parse(String(message.content));
  } catch {
    return {
      ok: false,
      code: "JSON_PARSE_ERROR",
      reason: `Failed to parse JSON from message ${message.id}`,
    };
  }

  let request: QuiverRequest;
  try {
    request = quiverRequestSchema.parse(json);
  } catch {
    return {
      ok: false,
      code: "SCHEMA_VALIDATION_ERROR",
      reason: `Failed to validate schema for message ${message.id}.`,
    };
  }

  return {
    ok: true,
    value: request,
  };
};
