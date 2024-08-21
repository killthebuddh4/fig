import { QuiverApi } from "../../types/QuiverApi";
import { create } from "zustand";

export const useStore = create<{
  api: QuiverApi;
}>(() => ({
  api: {},
}));
