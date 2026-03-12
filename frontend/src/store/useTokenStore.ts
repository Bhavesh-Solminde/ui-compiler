import { create } from "zustand";
import type { DesignSystemTokens } from "@resumer/shared-types";
import axiosInstance from "@/lib/axios";

interface TokenState extends DesignSystemTokens {
  updateToken: <K extends keyof DesignSystemTokens>(
    key: K,
    value: DesignSystemTokens[K]
  ) => void;
  exportTheme: () => Promise<void>;
}

export const useTokenStore = create<TokenState>((set, get) => ({
  radius: 0.5,
  primaryColor: "222.2 47.4% 11.2%",

  updateToken: (key, value) => {
    set({ [key]: value });
  },

  exportTheme: async () => {
    const { radius, primaryColor } = get();

    const response = await axiosInstance.post<Blob>(
      "/compiler/compile",
      { radius, primaryColor },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-ui.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
}));
