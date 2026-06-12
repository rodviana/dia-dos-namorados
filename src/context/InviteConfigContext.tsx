"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { InviteConfig } from "@/config/inviteConfig";

const InviteConfigContext = createContext<InviteConfig | null>(null);

type Props = {
  config: InviteConfig;
  children: ReactNode;
};

export function InviteConfigProvider({ config, children }: Props) {
  return (
    <InviteConfigContext.Provider value={config}>
      {children}
    </InviteConfigContext.Provider>
  );
}

export function useInviteConfig(): InviteConfig {
  const config = useContext(InviteConfigContext);
  if (!config) {
    throw new Error("useInviteConfig must be used within InviteConfigProvider");
  }
  return config;
}
