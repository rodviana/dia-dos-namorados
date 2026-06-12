# 💌 Convite Formal

Convite interativo em Next.js para chamar alguém para sair — com botão "Não" que foge, multa PIX e formulário para escolher data, horário e local.

## ✨ Funcionalidades

- **Convite formal** — tom elegante, personalizável
- **Botão "Não" que foge** — com multas PIX progressivas se clicar
- **Botão "Sim" que cresce** — quanto mais persegue o Não, maior fica o Sim
- **Formulário de encontro** — escolha de data, horário e local
- **Confirmação** — resumo do plano + copiar / WhatsApp
- **100% personalizável** — edite `src/config/inviteConfig.ts`

## 🚀 Como usar

### 1. Personalize

Edite `src/config/inviteConfig.ts`:

```ts
export const inviteConfig = {
  yourName: "Seu Nome",
  guestName: "Nome Dela/Ele",
  invitation: "Seu texto de convite...",
  dateOptions: [
    { id: "sab-14", label: "Sábado, 14 de junho" },
    // ...
  ],
  timeOptions: ["18:00", "19:00", "20:00"],
  placeOptions: [
    { id: "jantar", name: "Jantar", description: "...", icon: "🍽️" },
    // ...
  ],
  contact: {
    whatsapp: "5511999999999", // opcional
    label: "Me chama no WhatsApp",
  },
};
```

### 2. Rode localmente

```bash
npm install
npm run dev
```

### 3. Deploy

Push para o GitHub e importe no [Vercel](https://vercel.com).

## 🛠 Stack

Next.js 16 · TypeScript · Tailwind CSS
