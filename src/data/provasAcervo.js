export const PROVAS_OFICIAIS = [
  {
    id: "ENEM_2025_DIA1",
    nome: "ENEM 2025 - Dia 1",
    banca: "INEP",
    ano: 2025,
    categoria: "OFICIAL",
    pesoDificuldade: 1.0,
    matriz: [
      { materia: "Linguagens e Códigos", totalQuestoes: 45 },
      { materia: "Ciências Humanas", totalQuestoes: 45 }
    ],
    temRedacao: true
  },
  {
    id: "ENEM_2025_DIA2",
    nome: "ENEM 2025 - Dia 2",
    banca: "INEP",
    ano: 2025,
    categoria: "OFICIAL",
    pesoDificuldade: 1.0,
    matriz: [
      { materia: "Matemática", totalQuestoes: 45 },
      { materia: "Física", totalQuestoes: 15 },
      { materia: "Química", totalQuestoes: 15 },
      { materia: "Biologia", totalQuestoes: 15 }
    ],
    temRedacao: false
  },
  {
    id: "FUVEST_2025_FASE1",
    nome: "FUVEST 2025 - 1ª Fase",
    banca: "FUVEST",
    ano: 2025,
    categoria: "OFICIAL",
    pesoDificuldade: 1.2,
    matriz: [
      { materia: "Português", totalQuestoes: 18 },
      { materia: "Matemática", totalQuestoes: 12 },
      { materia: "História", totalQuestoes: 10 },
      { materia: "Geografia", totalQuestoes: 10 },
      { materia: "Física", totalQuestoes: 10 },
      { materia: "Química", totalQuestoes: 10 },
      { materia: "Biologia", totalQuestoes: 10 },
      { materia: "Inglês", totalQuestoes: 10 }
    ],
    temRedacao: false
  }
];