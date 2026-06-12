export const inviteConfig = {
  /** Seu nome */
  yourName: "Rodrigo",

  /** Nome da pessoa convidada */
  guestName: "Amor",

  /** Título do convite */
  title: "Convite Formal",

  /** Texto principal do convite */
  invitation:
    "Gostaria muito da honra da sua companhia em um encontro. Escolha o local, a data e o horário que mais combinarem com você — prometo fazer valer a pena.",

  /** Mensagem após confirmar o plano */
  confirmationMessage:
    "Perfeito! Já estou ansioso(a). Te mando os detalhes finais em breve.",

  /** WhatsApp para receber o resumo da confirmação */
  contact: {
    whatsapp: "5562999768895",
    label: "Enviar resumo no WhatsApp",
  },

  /** Atalhos de horário (opcional — o convidado pode escolher qualquer hora) */
  timePresets: [
    { period: "Manhã", icon: "🌅", times: ["08:00", "09:00", "10:00", "11:00"] },
    { period: "Tarde", icon: "☀️", times: ["12:00", "14:00", "15:00", "16:00", "17:00"] },
    { period: "Noite", icon: "🌙", times: ["18:00", "19:00", "20:00", "21:00", "22:00"] },
  ],

  /** Opções de local */
  placeOptions: [
    {
      id: "jantar",
      name: "Jantar",
      description: "Restaurante com boa conversa e comida gostosa",
      icon: "🍽️",
    },
    {
      id: "cinema",
      name: "Cinema",
      description: "Filme, pipoca e aquele climinha pós-sessão",
      icon: "🎬",
    },
    {
      id: "cafe",
      name: "Café",
      description: "Café, sobremesa e papo sem pressa",
      icon: "☕",
    },
    {
      id: "parque",
      name: "Passeio ao ar livre",
      description: "Parque, praça ou caminhada tranquila",
      icon: "🌳",
    },
    {
      id: "cultura",
      name: "Cultura",
      description: "Museu, exposição ou show",
      icon: "🎭",
    },
    {
      id: "bar",
      name: "Drinks",
      description: "Bar ou rooftop para um drink",
      icon: "🍸",
    },
    {
      id: "viagem",
      name: "Viagem",
      description: "Outra cidade, praia, serra — bora viajar juntos",
      icon: "✈️",
      allowCustom: true,
      customPlaceholder: "Para onde você quer ir?",
    },
    {
      id: "outro",
      name: "Outro / surpresa",
      description: "Sugira um lugar — estou aberto(a) a ideias!",
      icon: "✨",
      allowCustom: true,
      customPlaceholder: "Qual lugar você sugere?",
    },
  ],

  /** Chave PIX para a brincadeirinha de multa */
  pix: {
    key: "05692291118",
    displayKey: "056.922.911-18",
    holderName: "Rodrigo",
    label: "CPF",
  },

  /** Dívida por perseguir o botão Não */
  stalking: {
    /** Valor que sobe a cada fuga */
    feePerEscape: 1.5,
    /** A cada X fugas, abre multa automática */
    autoFineEvery: 4,
    /** Mensagem extra na multa automática */
    autoFineExtra:
      "Multa por insistir em perseguir o botão. Para de caçar o Não! 😤",
  },

  /** Multas progressivas por cada clique no "Não" */
  noFines: [
    {
      amount: 3.5,
      title: "Multa leve 🧾",
      message:
        "Tentativa de recusar um convite formal. Art. 1º do Código da Boa Companhia.",
    },
    {
      amount: 7.9,
      title: "Multa média 💸",
      message:
        "Reincidência detectada! O botão avisou que ia fugir e você insistiu.",
    },
    {
      amount: 12.99,
      title: "Multa grave 🚨",
      message:
        "Tentativa de sabotar um encontro promissor. Já era pra ter clicado no Sim!",
    },
    {
      amount: 19.9,
      title: "Multa máxima ⚖️",
      message:
        "Perseguição ao botão inocente. Paga o PIX ou aceita o convite. Escolhe.",
    },
    {
      amount: 29.9,
      title: "Dívida eterna 💀",
      message:
        "Nesse ponto, é mais barato confirmar o encontro do que continuar clicando em Não.",
    },
  ],

  /** Mensagens no botão enquanto foge */
  noButtonMessages: [
    "Não",
    "Não! 🏃",
    "Corre não!",
    "Pega se puder!",
    "Tá longe demais",
    "Desiste 😏",
    "Impossível",
    "Só no Sim!",
  ],

  /** Textos divertidos — personalize à vontade */
  fun: {
    /** Mensagens ao clicar em Sim (tela de loading) */
    loadingMessages: [
      "Processando seu sim...",
      "Cancelando planos de ficar em casa...",
      "Consultando o horóscopo do encontro...",
      "Avisando o universo que deu certo...",
      "Quase lá, segura a emoção!",
    ],

    /** Provocações quando o Não foge */
    taunts: [
      "Muito devagar! 🐢",
      "O Sim tá te olhando 👀",
      "Desiste não, vai!",
      "Tá cansado(a)?",
      "Quase... quase não!",
      "O Não não quer cooperar",
      "Tenta o botão verde ali →",
    ],

    /** Toasts estilo erro do sistema */
    errorToasts: [
      "ERRO 404: Desculpa não encontrada",
      "Não.exe parou de funcionar",
      "Falha ao recusar: permissão negada",
      "Acesso bloqueado pelo Código do Amor",
      "Bug detectado: você deveria clicar no Sim",
      "Wi-Fi do Não instável, tente o Sim",
    ],

    /** Labels do botão Sim conforme cresce */
    yesLabels: [
      "Sim! 💖",
      "Sim!! 💕",
      "SIM!!!",
      "CLICA AQUI",
      "VAI LOGO",
      "POR FAAAAVOR",
    ],

    /** Dicas que aparecem em destaque durante a brincadeira */
    escapeHints: {
      1: "O botão 'Não' tá fugindo! Aproxima o mouse e vê no que dá 🏃",
      2: "Quase pegou... quase! O botão é esperto 😏",
      3: "Clica nos corações ♥ flutuando — easter egg!",
      4: "A cada 4 perseguições abre multa SOZINHA. Cuidado! 📢",
      5: "Se conseguir clicar no Não... multa com PIX 😈",
      7: "A dívida só sobe! Cada fuga custa caro. O Sim tá gigante!",
      10: "O Sim tá gigante. É um sinal do universo. ✨",
    },

    /** Mensagens ao clicar nos corações */
    heartClicks: [
      "+1 ponto de fofura",
      "Coração capturado!",
      "O universo aprova",
      "Isso conta como sim emocional",
      "Mais um ❤️ no bolso",
    ],
  },
};

export type DatePlan = {
  dateLabel: string;
  time: string;
  placeName: string;
  customPlace?: string;
  note?: string;
};
