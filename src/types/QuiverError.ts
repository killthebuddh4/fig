export type QuiverError = {
  id: string;
  ok: false;
  status:
    | "INPUT_SERIALIZATION_FAILED"
    | "XMTP_SEND_FAILED"
    | "XMTP_BROADCAST_FAILED"
    | "UNKNOWN_FUNCTION"
    | "INPUT_INVALID_JSON"
    | "INPUT_TYPE_MISMATCH"
    | "OUTPUT_TYPE_MISMATCH"
    | "OUTPUT_SERIALIZATION_FAILED"
    | "INVALID_RESPONSE"
    | "INVALID_REQUEST"
    | "INVALID_PAYLOAD"
    | "UNAUTHORIZED"
    | "REQUEST_TIMEOUT"
    | "SERVER_ERROR";
  data?: undefined;
};
