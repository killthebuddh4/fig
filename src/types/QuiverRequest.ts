import { z } from "zod";
import { quiverRequestSchema } from "../hooks/quiver/quiverRequestSchema";

export type QuiverRequest = z.infer<typeof quiverRequestSchema>;
