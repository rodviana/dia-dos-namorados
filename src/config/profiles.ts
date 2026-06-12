import type { InviteConfig } from "./inviteConfig";

/** Campos que cada perfil pode sobrescrever em cima do default */
export type InviteProfileOverrides = {
  yourName?: string;
  guestName?: string;
  title?: string;
  invitation?: string;
  confirmationMessage?: string;
  music?: Partial<InviteConfig["music"]>;
  contact?: Partial<InviteConfig["contact"]>;
  pix?: Partial<InviteConfig["pix"]>;
  stalking?: Partial<InviteConfig["stalking"]>;
  timePresets?: InviteConfig["timePresets"];
  placeOptions?: InviteConfig["placeOptions"];
  noFines?: InviteConfig["noFines"];
  noButtonMessages?: InviteConfig["noButtonMessages"];
  fun?: Partial<Omit<InviteConfig["fun"], "escapeHints">> & {
    escapeHints?: Partial<InviteConfig["fun"]["escapeHints"]>;
  };
};

/**
 * Perfis por slug — cada um vira um link: /rafaela, /maria, etc.
 * Só preencha o que for diferente do default.
 */
export const inviteProfiles: Record<string, InviteProfileOverrides> = {
  vini: {
    yourName: "Vinicius",
    guestName: "Amor",
    title: "Convite Formal",
    contact: {
      whatsapp: "5562986223262",
      label: "Enviar resumo no WhatsApp",
    },
    pix: {
      key: "62986223262",
      displayKey: "(62) 98622-3262",
      holderName: "Vinicius",
      label: "Telefone",
    },
  },
  rafaela: {
    guestName: "Rafaela",
    invitation:
      "A gente já vai sair hoje — isso tá resolvido. Mas fiz esse site idiota só pra você rir. Escolhe o que quiser aqui embaixo, ou vai direto no Sim.",
    confirmationMessage:
      "Perfeito! Te vejo mais tarde. (O encontro de verdade já tava marcado 😌)",
    // contact, pix etc. herdam do default — mude só se precisar:
    // contact: { whatsapp: "55...", label: "..." },
    // pix: { key: "...", displayKey: "...", holderName: "...", label: "CPF" },
  },
};
