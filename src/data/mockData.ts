export interface RoadmapPhase {
  id: number;
  name: string;
  months: string;
  description: string;
  color: "blue" | "green" | "amber";
  milestones: {
    month: number;
    title: string;
    items: string[];
    highlights?: string[];
  }[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 0,
    name: "Quick Wins & Alinhamento",
    months: "Meses 1–2",
    description: "Gerar valor visível rápido enquanto se faz o diagnóstico completo.",
    color: "green",
    milestones: [
      {
        month: 1,
        title: "Kick-off + Primeiros Resultados",
        items: [
          "Workshop de alinhamento com stakeholders-chave",
          "Mapeamento dos processos licitatórios atuais (as-is)",
          "Levantamento de fontes de dados e sistemas existentes",
          "Definição de KPIs de sucesso do projeto",
        ],
        highlights: ["Quick Win 1: Varredura automatizada de editais em portais públicos (PNCP, ComprasNet) com alertas por e-mail"],
      },
      {
        month: 2,
        title: "Diagnóstico + Mais Valor Rápido",
        items: [
          "Documento de diagnóstico completo (gaps, riscos, oportunidades)",
          "Definição da arquitetura-alvo das 4 camadas",
        ],
        highlights: [
          "Quick Win 2: Dashboard de acompanhamento de editais capturados (volume, categorias, prazos)",
          "Quick Win 3: Classificação básica de editais por relevância usando regras de negócio",
        ],
      },
    ],
  },
  {
    id: 1,
    name: "Construção da Base",
    months: "Meses 3–5",
    description: "Montar a camada de Coleta & Estruturação e iniciar Análise & Inferência.",
    color: "blue",
    milestones: [
      {
        month: 3,
        title: "Coleta & Estruturação",
        items: [
          "Configuração do ambiente controlado (infraestrutura isolada)",
          "Integração com fontes de editais (portais públicos + bases internas)",
          "Pipeline de ingestão e estruturação de dados de editais",
          "Controles de rastreabilidade e auditoria (log imutável)",
        ],
      },
      {
        month: 4,
        title: "Análise & Inferência (1)",
        items: [
          "Modelos de extração de dados-chave (requisitos, prazos, valores, critérios)",
          "Treinamento inicial com dados históricos do Cesgranio",
          "Validação inicial com a equipe de licitações",
        ],
      },
      {
        month: 5,
        title: "Análise & Inferência (2)",
        items: [
          "Modelo de previsão de sucesso/aderência por edital",
          "Scoring de editais por probabilidade de vitória",
          "Conformidade LGPD plena validada",
        ],
        highlights: ["Entregável: Motor de análise em homologação"],
      },
    ],
  },
  {
    id: 2,
    name: "Inteligência Avançada",
    months: "Meses 6–8",
    description: "Camada de priorização e orquestração com decisão assistida por IA.",
    color: "blue",
    milestones: [
      {
        month: 6,
        title: "Priorização",
        items: [
          "Algoritmo de priorização multicritério",
          "Interface de recomendação para equipe comercial",
          "Integração com calendário de licitações",
        ],
      },
      {
        month: 7,
        title: "Preparo",
        items: [
          "Templates inteligentes para montagem de propostas",
          "Geração automatizada de checklists de conformidade",
          "Assistente de redação para propostas técnicas",
        ],
      },
      {
        month: 8,
        title: "Orquestração",
        items: [
          "Workflow de aprovação de propostas",
          "Dashboard executivo com métricas de pipeline",
          "Alertas e notificações inteligentes",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Validação & Escala",
    months: "Meses 9–12",
    description: "Piloto controlado, validação com usuários finais e expansão gradual.",
    color: "amber",
    milestones: [
      {
        month: 9,
        title: "Piloto",
        items: [
          "Piloto controlado com 3 editais reais",
          "Medição de KPIs definidos no mês 1",
          "Ajustes baseados em feedback dos usuários",
        ],
      },
      {
        month: 10,
        title: "Validação",
        items: [
          "Validação completa com equipe ampliada",
          "Documentação de processos e treinamento",
          "Relatório de ROI preliminar",
        ],
      },
      {
        month: 11,
        title: "Expansão",
        items: [
          "Expansão para todos os tipos de licitação",
          "Integração com sistemas legados",
          "Onboarding de novos usuários",
        ],
      },
      {
        month: 12,
        title: "Go-Live",
        items: [
          "Go-live completo em produção",
          "Handover para equipe interna",
          "Plano de evolução contínua",
        ],
      },
    ],
  },
];

export const currentMonth = 4; // We're in month 4

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "alta" | "média" | "baixa";
  tags: string[];
  dueDate?: string;
}

export type KanbanStatus = "backlog" | "priorizada" | "em_andamento" | "bloqueada" | "aguardando_validacao" | "concluida";

export const kanbanColumns: { id: KanbanStatus; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "bg-muted" },
  { id: "priorizada", label: "Priorizada", color: "bg-primary/10" },
  { id: "em_andamento", label: "Em Andamento", color: "bg-info/10" },
  { id: "bloqueada", label: "Bloqueada", color: "bg-destructive/10" },
  { id: "aguardando_validacao", label: "Aguardando Validação", color: "bg-warning/10" },
  { id: "concluida", label: "Concluída", color: "bg-success/10" },
];

export const kanbanTasks: Record<KanbanStatus, KanbanTask[]> = {
  backlog: [
    { id: "t1", title: "Integração com ComprasNet", description: "Conectar API do ComprasNet para captura automática", assignee: "Lucas", priority: "média", tags: ["integração"] },
    { id: "t2", title: "Modelo de scoring v2", description: "Evoluir modelo de scoring com novos features", assignee: "Ana", priority: "baixa", tags: ["IA", "modelo"] },
  ],
  priorizada: [
    { id: "t3", title: "Pipeline de ingestão de editais", description: "Criar pipeline de ETL para novos editais", assignee: "Rafael", priority: "alta", tags: ["dados", "ETL"], dueDate: "2025-04-15" },
    { id: "t4", title: "Dashboard de métricas", description: "Métricas de volume e categorias de editais", assignee: "Mariana", priority: "alta", tags: ["frontend", "dashboard"] },
  ],
  em_andamento: [
    { id: "t5", title: "Extração de requisitos com NLP", description: "Modelo NLP para extrair requisitos chave de editais", assignee: "Ana", priority: "alta", tags: ["IA", "NLP"], dueDate: "2025-04-10" },
    { id: "t6", title: "Ambiente de staging", description: "Configurar infraestrutura isolada para testes", assignee: "Lucas", priority: "média", tags: ["infra"] },
    { id: "t7", title: "Alertas por e-mail", description: "Sistema de notificações para novos editais relevantes", assignee: "Rafael", priority: "média", tags: ["backend", "notificação"] },
  ],
  bloqueada: [
    { id: "t8", title: "Acesso à base histórica", description: "Aguardando liberação de acesso aos dados históricos do Cesgranio", assignee: "Lucas", priority: "alta", tags: ["dados", "bloqueio externo"] },
  ],
  aguardando_validacao: [
    { id: "t9", title: "Varredura de portais públicos", description: "Crawler para PNCP e ComprasNet implementado", assignee: "Rafael", priority: "alta", tags: ["crawler", "quick win"] },
    { id: "t10", title: "Classificação por regras de negócio", description: "Regras iniciais de classificação de editais", assignee: "Ana", priority: "média", tags: ["regras", "quick win"] },
  ],
  concluida: [
    { id: "t11", title: "Workshop de alinhamento", description: "Workshop realizado com todos stakeholders", assignee: "Mariana", priority: "alta", tags: ["gestão"] },
    { id: "t12", title: "Mapeamento de processos as-is", description: "Documentação dos processos atuais completa", assignee: "Mariana", priority: "alta", tags: ["documentação"] },
    { id: "t13", title: "Definição de KPIs", description: "KPIs de sucesso definidos e aprovados", assignee: "Mariana", priority: "alta", tags: ["gestão"] },
  ],
};

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  summary: string;
  transcription: string;
  actionItems: string[];
  tags: string[];
}

export const meetings: Meeting[] = [
  {
    id: "m1",
    title: "Kick-off do Projeto",
    date: "2025-03-03",
    duration: "1h30",
    participants: ["Mariana Costa", "Lucas Silva", "Ana Rodrigues", "Rafael Santos", "Dr. Pedro Almeida (Cesgranio)"],
    summary: "Reunião inaugural do projeto Dante Decision Engine com o Cesgranio. Foram apresentados os objetivos gerais, cronograma de 12 meses e metodologia de trabalho. O Dr. Pedro reforçou a importância da conformidade com LGPD e a necessidade de resultados rápidos nos primeiros meses.",
    transcription: "Mariana: Bom dia a todos, obrigada por estarem aqui. Hoje damos início oficialmente ao projeto Dante Decision Engine...\n\nDr. Pedro: Estamos muito animados com essa parceria. A Cesgranio tem um volume muito grande de licitações e precisamos de uma forma inteligente de priorizá-las...\n\nLucas: Em termos técnicos, vamos começar com o mapeamento das fontes de dados existentes. Já identificamos o PNCP e o ComprasNet como fontes primárias...\n\nAna: Do lado de IA, nossa proposta é começar com regras de negócio simples para classificação e evoluir para modelos de NLP mais sofisticados...\n\nRafael: A infraestrutura será montada com foco em isolamento e rastreabilidade desde o dia 1...",
    actionItems: [
      "Mariana: Enviar cronograma detalhado até sexta-feira",
      "Lucas: Levantar acessos necessários às bases de dados",
      "Ana: Preparar proposta de modelo de classificação inicial",
      "Rafael: Definir arquitetura de infraestrutura",
      "Dr. Pedro: Liberar acesso ao ambiente de homologação",
    ],
    tags: ["kick-off", "alinhamento"],
  },
  {
    id: "m2",
    title: "Review Sprint 1 — Quick Wins",
    date: "2025-03-17",
    duration: "1h",
    participants: ["Mariana Costa", "Lucas Silva", "Rafael Santos", "Dr. Pedro Almeida (Cesgranio)"],
    summary: "Apresentação dos primeiros quick wins: varredura automatizada de editais em portais públicos com alertas por e-mail. O sistema já captura editais do PNCP e ComprasNet automaticamente. Dr. Pedro ficou impressionado com a velocidade de entrega e sugeriu priorizar o dashboard de acompanhamento.",
    transcription: "Mariana: Vamos ao review da primeira sprint. Rafael, pode apresentar o que foi entregue?\n\nRafael: Claro. Implementamos o crawler para PNCP e ComprasNet. Ele roda a cada 6 horas e já capturou 347 editais na última semana. Os alertas por e-mail estão funcionando para 3 categorias que definimos com o Dr. Pedro...\n\nDr. Pedro: Excelente trabalho. Já recebi os alertas e a relevância está boa. Acho que o próximo passo deveria ser o dashboard para acompanharmos volume e categorias...\n\nLucas: Concordo. Já temos os dados estruturados, é viável entregar o dashboard na próxima sprint...",
    actionItems: [
      "Rafael: Adicionar mais 5 categorias de editais ao filtro",
      "Lucas: Iniciar desenvolvimento do dashboard de acompanhamento",
      "Mariana: Agendar demo do dashboard para próxima semana",
    ],
    tags: ["review", "quick win", "sprint 1"],
  },
  {
    id: "m3",
    title: "Diagnóstico Completo — Apresentação",
    date: "2025-04-01",
    duration: "2h",
    participants: ["Mariana Costa", "Lucas Silva", "Ana Rodrigues", "Rafael Santos", "Dr. Pedro Almeida (Cesgranio)", "Dra. Carla Mendes (Cesgranio)"],
    summary: "Apresentação do documento de diagnóstico completo incluindo gaps, riscos e oportunidades identificados. Definição da arquitetura-alvo das 4 camadas. A Dra. Carla levantou questões importantes sobre compliance e auditoria que serão endereçadas na fase de Construção da Base.",
    transcription: "Mariana: Hoje vamos apresentar o diagnóstico completo do mês 2. Ana vai começar com os gaps identificados...\n\nAna: Identificamos 3 gaps principais: 1) ausência de estruturação de dados históricos, 2) processos manuais de classificação, e 3) falta de métricas de performance por tipo de licitação...\n\nDra. Carla: E quanto à auditoria? Precisamos de rastreabilidade completa de todas as decisões do sistema...\n\nRafael: Já previmos isso na arquitetura. Cada camada terá log imutável com timestamp e identificação do modelo ou regra que gerou a decisão...",
    actionItems: [
      "Ana: Finalizar documento de arquitetura das 4 camadas",
      "Rafael: Desenhar fluxo de auditoria end-to-end",
      "Lucas: Iniciar configuração do ambiente controlado",
      "Mariana: Criar backlog de atividades para meses 3-5",
    ],
    tags: ["diagnóstico", "arquitetura", "compliance"],
  },
  {
    id: "m4",
    title: "Planning Sprint 3 — Coleta & Estruturação",
    date: "2025-04-07",
    duration: "45min",
    participants: ["Mariana Costa", "Lucas Silva", "Ana Rodrigues", "Rafael Santos"],
    summary: "Planejamento da sprint focada na construção do pipeline de ingestão e estruturação de dados. Priorização das integrações com portais públicos e definição do formato de dados estruturados para editais.",
    transcription: "Mariana: Vamos planejar a sprint 3. O foco principal é montar o pipeline de ingestão. Lucas, qual é o status do ambiente?\n\nLucas: O ambiente de staging está 80% pronto. Falta configurar o banco de dados e os jobs de ETL...\n\nAna: Preciso dos dados estruturados para começar a treinar os modelos de extração. Podemos definir o schema hoje?\n\nRafael: Sim, já tenho uma proposta de schema baseada nos editais que analisamos...",
    actionItems: [
      "Lucas: Finalizar ambiente de staging até quarta",
      "Rafael: Implementar pipeline de ETL para editais do PNCP",
      "Ana: Definir schema de dados estruturados com Rafael",
      "Mariana: Atualizar roadmap com progresso",
    ],
    tags: ["planning", "sprint 3", "dados"],
  },
];
