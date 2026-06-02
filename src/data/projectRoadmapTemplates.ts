export type RoadmapTemplate = {
  projectKey: string;
  title: string;
  completedThrough: number;
  currentWeek: number;
  months: {
    month: number;
    label: string;
    title: string;
    items: string[];
    highlights?: string[];
  }[];
  phases: {
    name: string;
    description: string;
    color: "green" | "blue" | "amber";
    startMonth: number;
    endMonth: number;
  }[];
};

const weekLabels = [
  "27/05-02/06",
  "03/06-09/06",
  "10/06-16/06",
  "17/06-23/06",
  "24/06-30/06",
  "01/07-07/07",
  "08/07-14/07",
  "15/07-21/07",
  "22/07-28/07",
  "29/07-04/08",
];

export const projectRoadmapTemplates: RoadmapTemplate[] = [
  {
    projectKey: "dantia-landing",
    title: "dantia-landing",
    completedThrough: 3,
    currentWeek: 4,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: deixar a vitrine da DantIA pronta para vender e receber contatos.", color: "green", startMonth: 1, endMonth: 1 },
      { name: "Construção da Base", description: "Arrumar formulário, LGPD e avisos para a equipe comercial responder rápido.", color: "blue", startMonth: 2, endMonth: 2 },
      { name: "Inteligência Avançada", description: "Medir visitantes, cliques e contatos para decidir onde melhorar.", color: "blue", startMonth: 3, endMonth: 3 },
      { name: "Validação & Escala", description: "Usar os números da landing para orientar campanhas e novas mensagens.", color: "amber", startMonth: 4, endMonth: 4 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Página pronta para vender a DantIA", items: ["Explicar, em linguagem simples, o que a DantIA faz.", "Mostrar confiança: empresa, privacidade e forma de contato.", "Conferir se o formulário envia o pedido corretamente."], highlights: ["Quick Win 1: a CEO já pode mandar o link da DantIA para clientes e parceiros."] },
      { month: 2, label: "Captação", title: "Contato vira oportunidade clara", items: ["Perguntar o mínimo necessário para entender o interesse do lead.", "Separar o contato por assunto: IA, automação, consultoria ou produto.", "Avisar a equipe quando alguém pedir conversa."], highlights: ["Quick Win 2: cada contato recebido já chega com contexto para o comercial agir."] },
      { month: 3, label: "Medição", title: "Números para decidir o próximo passo", items: ["Medir visitas, cliques e formulários enviados.", "Ver de onde vêm os melhores contatos.", "Definir a próxima melhoria da mensagem ou da campanha."], highlights: ["Quick Win 3: a landing deixa de ser só página e vira ativo comercial medido."] },
      { month: 4, label: "Escala", title: "Mensagem pronta para campanha", items: ["Escolher a melhor chamada comercial.", "Preparar variações para campanha paga ou outbound.", "Definir rotina simples de revisão semanal."], highlights: ["Quick Win 4: a landing passa a orientar campanhas com dados reais."] },
    ],
  },
  {
    projectKey: "dantia-forge",
    title: "dantia-forge",
    completedThrough: 5,
    currentWeek: 6,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: criar o jeito padrão de construir produtos com agentes.", color: "green", startMonth: 1, endMonth: 2 },
      { name: "Construção da Base", description: "Colocar travas, testes e revisões para os agentes trabalharem com segurança.", color: "blue", startMonth: 3, endMonth: 4 },
      { name: "Inteligência Avançada", description: "Usar o Forge para acelerar vários projetos ao mesmo tempo sem perder controle.", color: "blue", startMonth: 5, endMonth: 5 },
      { name: "Validação & Escala", description: "Preparar acompanhamento remoto, memória e relatório executivo do valor gerado.", color: "amber", startMonth: 6, endMonth: 6 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Regra simples para construir bem", items: ["Organizar os princípios que todos os agentes devem seguir.", "Criar modelos de plano, tarefa, teste e auditoria.", "Explicar o Forge para humano, desenvolvedor e agente."], highlights: ["Quick Win 1: todo projeto passa a nascer com o mesmo padrão de qualidade."] },
      { month: 2, label: "Quick Win", title: "Método instalado nos projetos reais", items: ["Validar uso em Sapiro, Happiness e DantIA Social.", "Remover pontos confusos de instalação.", "Criar exemplos que a equipe consegue repetir."], highlights: ["Quick Win 2: a fábrica deixa de depender de memória individual e passa a seguir método."] },
      { month: 3, label: "Qualidade", title: "Qualidade com testes e CI primeiro", items: ["Exigir testes automáticos (TDD) antes de aceitar qualquer entrega.", "Montar a esteira de CI/CD que barra código sem teste.", "Garantir critério de pronto para a demo não virar produção sem validação."], highlights: ["Quick Win 3: menos retrabalho e menos risco nas entregas feitas por agentes."] },
      { month: 4, label: "Consumo", title: "Forge fácil de consumir e rastreável", items: ["Reduzir o atrito para outros projetos adotarem o Forge (modo consumidor).", "Adicionar skills de ciclo de desenvolvimento sem quebrar o que já existe.", "Registrar decisões importantes em ADRs para rastreabilidade."], highlights: ["Quick Win 4: outros projetos passam a usar o Forge com menos atrito e tudo registrado."] },
      { month: 5, label: "Operação", title: "Inteligência operacional: Hermes e métricas", items: ["Conectar o Hermes para operar e acompanhar os agentes remotamente.", "Medir custo, qualidade e uso por meio de analytics (WireLog).", "Transformar aprendizados em padrões reutilizáveis pela fábrica."], highlights: ["Quick Win 5: a fábrica passa a ser acompanhada por métricas, não por achismo."] },
      { month: 6, label: "Go-Live", title: "Go-Live com validação e auditoria", items: ["Ativar o modo piloto (PILOT) com pré-validação sintética antes da produção.", "Rodar a primeira auditoria mensal real com o reviewer.", "Salvar aprendizados por projeto e entregar o relatório executivo do valor do Forge."], highlights: ["Quick Win 6: o Forge vira o sistema operacional da fábrica DantIA."] },
    ],
  },
  {
    projectKey: "sapiro",
    title: "Sapiro",
    completedThrough: 3,
    currentWeek: 4,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: deixar o Sapiro com regras, ambiente seguro e medição antes de aprender com clientes.", color: "green", startMonth: 1, endMonth: 2 },
      { name: "Construção da Base", description: "Trocar a fila antiga pelo fluxo novo, guardar feedback do cliente e colocar esse aprendizado no contexto dos agentes.", color: "blue", startMonth: 3, endMonth: 5 },
      { name: "Inteligência Avançada", description: "Fazer o agente aprender em ciclo fechado, medir se melhorou e desligar autonomia quando a qualidade cair.", color: "blue", startMonth: 6, endMonth: 8 },
      { name: "Validação & Escala", description: "Aprender com grupos parecidos sem expor dados, testar prompts continuamente e mostrar ao cliente o que o Sapiro aprendeu.", color: "amber", startMonth: 9, endMonth: 10 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Constituição dos agentes aprovada", items: ["Registrar no CLAUDE.md as regras que todo agente deve seguir.", "Conectar LangSmith para enxergar o que o agente fez.", "Definir que aprendizado só vale quando tiver sinal confiável."], highlights: ["Quick Win 1: a CEO sabe qual é a regra do jogo dos agentes."] },
      { month: 2, label: "Quick Win", title: "Staging isolado para aprender sem risco", items: ["Separar Postgres, Redis, Vertex e LangSmith do ambiente principal.", "Garantir que teste de aprendizado não mexe em cliente real.", "Deixar trilha clara de onde cada experimento rodou."], highlights: ["Quick Win 2: o Sapiro pode testar inteligência nova sem arriscar produção."] },
      { month: 3, label: "LangGraph", title: "LangGraph validado em staging", items: ["Ligar o fluxo novo (ADR-011) no monthly-analysis.", "Validar primeiro em staging isolado, sem afetar cliente real.", "Comparar erro, tempo e custo contra a fila antiga."], highlights: ["Quick Win 3: análise mensal passa a ter fluxo mais rastreável sem troca brusca em produção."] },
      { month: 4, label: "Action Plan", title: "Plano de ação vira acompanhamento", items: ["Criar status simples: criado, aceito, em execução, concluído.", "Guardar histórico de mudanças do plano.", "Transformar aprovação do cliente em sinal para o agente."], highlights: ["Quick Win 4: recomendação deixa de ser texto solto e vira acompanhamento de negócio."] },
      { month: 5, label: "Memória", title: "Memória por cliente no contexto", items: ["Criar TenantMemoryItem para aprendizados úteis.", "Buscar feedback aprovado antes da resposta.", "Injetar memória L1 sem misturar dados de empresas."], highlights: ["Quick Win 5: o Sapiro começa a lembrar preferências do cliente com segurança."] },
      { month: 6, label: "SelfHarness", title: "Primeiro ciclo fechado de aprendizado", items: ["Criar worker que lê correções de classificação.", "Transformar correctedCategory em memória útil.", "Testar se a próxima análise melhora depois da correção."], highlights: ["Quick Win 6: quando o cliente corrige uma categoria, o Sapiro aprende para a próxima vez."] },
      { month: 7, label: "Gate 95", title: "Qualidade medida e autonomia controlada", items: ["Criar ValidationMetric para medir qualidade por agente.", "Criar AutonomyGate com meta de 95%.", "Rebaixar para modo assistido quando a qualidade cair."], highlights: ["Quick Win 7: agente só ganha liberdade quando prova que está bom."] },
      { month: 8, label: "LGPD", title: "Aprendizado coletivo protegido", items: ["Criar GlobalSignal sem expor cliente.", "Usar concordância entre empresas do mesmo segmento.", "Exigir pelo menos 5 clientes parecidos antes de usar sinal agregado."], highlights: ["Quick Win 8: o Sapiro aprende com o grupo sem revelar dados de uma empresa."] },
      { month: 9, label: "Prompts", title: "Avaliação contínua e prompts melhores", items: ["Rodar EvalContinuous toda semana.", "Guardar versões boas em PromptMemory.", "Testar variações com bandit e rollback simples."], highlights: ["Quick Win 9: prompts melhoram por evidência, não por chute."] },
      { month: 10, label: "Go-Live", title: "Transparência para o cliente e escala", items: ["Mostrar a tela: o que o Sapiro aprendeu sobre você.", "Permitir editar ou descartar aprendizado errado.", "Entregar relatório executivo para decidir expansão."], highlights: ["Quick Win 10: cliente entende, controla e aprova o que a IA aprende sobre ele."] },
    ],
  },
  {
    projectKey: "happiness",
    title: "Happiness",
    completedThrough: 6,
    currentWeek: 7,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: trocar rotinas básicas do sistema antigo sem parar a operação.", color: "green", startMonth: 1, endMonth: 2 },
      { name: "Construção da Base", description: "Organizar leads, atendimento, agenda e matrícula para vender melhor.", color: "blue", startMonth: 3, endMonth: 5 },
      { name: "Inteligência Avançada", description: "Controlar dinheiro, contratos e situação do aluno com clareza de gestão.", color: "blue", startMonth: 6, endMonth: 8 },
      { name: "Validação & Escala", description: "Completar pedagógico, RH, parâmetros e piloto com unidade real.", color: "amber", startMonth: 9, endMonth: 10 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Usuários, perfis e cadastros", items: ["Garantir login por perfil e unidade.", "Migrar equipes, turnos e perfis.", "Criar menu simples por módulo."], highlights: ["Quick Win 1: a equipe entra no sistema novo e acha as rotinas principais."] },
      { month: 2, label: "Quick Win", title: "Jovens e leads em um só lugar", items: ["Cadastrar jovem, responsável e contatos.", "Buscar por nome, ID e status.", "Ligar jovem a contrato, CRM e atendimento."], highlights: ["Quick Win 2: a escola deixa de procurar informação em várias telas."] },
      { month: 3, label: "CRM", title: "CRM mostra o funil", items: ["Criar etapas, campanhas e origens.", "Importar leads por CSV.", "Mostrar funil de vendas e conversão."], highlights: ["Quick Win 3: a gestão vê onde a venda está travando."] },
      { month: 4, label: "Agenda", title: "Tele-pesquisa e agenda", items: ["Controlar operador, turno e produtividade.", "Bloquear telefones que não podem receber ligação.", "Preparar lista para tele-projeto."], highlights: ["Quick Win 4: ligações ficam organizadas e mensuráveis."] },
      { month: 5, label: "Matrícula", title: "Recepção, OEDU e matrícula", items: ["Agendar e receber visitas.", "Registrar atendimento do orientador.", "Emitir contrato e fechamento comercial."], highlights: ["Quick Win 5: venda roda de ponta a ponta no Happiness."] },
      { month: 6, label: "Receber", title: "Contas a receber", items: ["Controlar contratos e parcelas.", "Dar baixa em dinheiro, boleto, cartão e cheque.", "Gerar relatório de faturamento."], highlights: ["Quick Win 6: a escola sabe o que tem para receber."] },
      { month: 7, label: "Pagamentos", title: "Gateway de pagamentos (Asaas)", items: ["Integrar boleto, PIX e cartão pelo gateway Asaas.", "Conciliar os recebimentos automaticamente com o financeiro.", "Reduzir o lançamento manual de caixa e a baixa de parcelas."], highlights: ["Quick Win 7: pagamentos entram e baixam sozinhos, com menos esforço manual."] },
      { month: 8, label: "Aluno", title: "Administrativo do aluno", items: ["Fazer trancamento, cancelamento e conclusão.", "Calcular multa e regras de retorno.", "Criar relatórios de cobrança e ranking."], highlights: ["Quick Win 8: decisões sobre aluno e contrato ficam rastreáveis."] },
      { month: 9, label: "Escola", title: "Pedagógico, RH e parâmetros", items: ["Mapear faltas, reposições, turmas e pautas.", "Cadastrar empresas, vagas e encaminhamentos.", "Centralizar regras configuráveis da escola."], highlights: ["Quick Win 9: a operação inteira começa a caber no mesmo sistema."] },
      { month: 10, label: "Go-Live", title: "Piloto com unidade real", items: ["Rodar aceite com usuários reais.", "Corrigir diferenças contra o CAPSYSTEM.", "Preparar módulos para virarem canônicos."], highlights: ["Quick Win 10: caminho claro para substituir o sistema legado."] },
    ],
  },
  {
    projectKey: "dantia-forja-comercial",
    title: "dantia-forja-comercial",
    completedThrough: 5,
    currentWeek: 6,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: decidir regras, consentimento e material permitido antes de ouvir vendas.", color: "green", startMonth: 1, endMonth: 2 },
      { name: "Construção da Base", description: "Fazer a IA ouvir a conversa, entender gatilhos e sugerir o próximo passo.", color: "blue", startMonth: 3, endMonth: 5 },
      { name: "Inteligência Avançada", description: "Mostrar sugestões simples para o closer durante a ligação.", color: "blue", startMonth: 6, endMonth: 7 },
      { name: "Validação & Escala", description: "Aprender com chamadas reais, resumir follow-up e preparar integração com CRM.", color: "amber", startMonth: 8, endMonth: 8 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Regras do jogo aprovadas", items: ["Escolher captura, STT, login e CRM.", "Aprovar texto LGPD para avisar o cliente.", "Escolher 3 a 5 closers para teste SHADOW."], highlights: ["Quick Win 1: a CEO sabe exatamente o que está sendo testado."] },
      { month: 2, label: "Quick Win", title: "Material de vendas limpo", items: ["Tirar marcas proibidas do corpus.", "Criar lista de etapas da conversa.", "Criar lista de gatilhos: caro, vou pensar, já tenho etc."], highlights: ["Quick Win 2: a IA aprende com material seguro e aprovado."] },
      { month: 3, label: "Coleta", title: "Transcrição ao vivo", items: ["Testar Deepgram ou Recall em PT-BR.", "Medir atraso da fala para o texto.", "Guardar trechos com horário."], highlights: ["Quick Win 3: a conversa vira texto útil em tempo quase real."] },
      { month: 4, label: "Sugestão", title: "Resposta em menos de 3 segundos", items: ["Detectar gatilho na fala.", "Gerar sugestão curta para o closer.", "Bloquear vazamento de marca antes de mostrar."], highlights: ["Quick Win 4: o closer recebe ajuda enquanto ainda pode mudar a venda."] },
      { month: 5, label: "Teste", title: "Motor validado com áudios", items: ["Criar 50 cenários de venda.", "Rodar teste ponta a ponta.", "Aprovar latência e qualidade."], highlights: ["Quick Win 5: motor provado antes de colocar em chamada real."] },
      { month: 6, label: "Painel", title: "Tela simples para o closer", items: ["Mostrar transcrição de um lado e cards do outro.", "Mostrar etapa da conversa e tempo de fala.", "Botões: foi útil, não foi útil, dispensar."], highlights: ["Quick Win 6: a sugestão aparece sem atrapalhar a conversa."] },
      { month: 7, label: "Piloto", title: "Teste em ligações reais", items: ["Rodar com 1 a 2 closers primeiro.", "Medir utilidade e falsos alarmes.", "Ajustar para sugerir menos e melhor."], highlights: ["Quick Win 7: a equipe valida se a IA ajuda de verdade na venda."] },
      { month: 8, label: "Escala", title: "Resumo, CRM e aprendizado", items: ["Gerar resumo e follow-up depois da chamada.", "Enviar dados para o CRM escolhido.", "Criar fila de melhorias aprovadas por humano."], highlights: ["Quick Win 8: co-pilot pronto para decisão de escala."] },
    ],
  },
  {
    projectKey: "dantia_social",
    title: "dantia_social",
    completedThrough: 3,
    currentWeek: 4,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: organizar marca, tom e base comum dos agentes.", color: "green", startMonth: 1, endMonth: 1 },
      { name: "Construção da Base", description: "Colocar social, copy e design para produzir com padrão de marca.", color: "blue", startMonth: 2, endMonth: 4 },
      { name: "Inteligência Avançada", description: "Adicionar tráfego pago e cortes de vídeo com controle de custo.", color: "blue", startMonth: 5, endMonth: 5 },
      { name: "Validação & Escala", description: "Orquestrar agentes, medir ROI e preparar rotina mensal de auditoria.", color: "amber", startMonth: 6, endMonth: 6 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Marca e motor comum", items: ["Organizar brand guide e tom da DantIA.", "Criar domínio, portas e observabilidade.", "Validar social-media-agent já iniciado."], highlights: ["Quick Win 1: uma base de marca que todos os agentes reutilizam."] },
      { month: 2, label: "Quick Win", title: "Social-media-agent", items: ["Gerar carrossel com legenda.", "Publicar em LinkedIn, Instagram, Facebook e X.", "Rodar avaliação para saber se está on-brand."], highlights: ["Quick Win 2: conteúdo social passa a sair com padrão e velocidade."] },
      { month: 3, label: "Copy", title: "Copywriter-agent", items: ["Gerar landing, e-mails e anúncios.", "Checar variedade e qualidade da copy.", "Definir preço padrão e upsell."], highlights: ["Quick Win 3: campanhas ganham texto pronto para testar."] },
      { month: 4, label: "Design", title: "Designer-agent", items: ["Criar design de carrossel completo.", "Validar aderência à marca.", "Levar os 3 agentes P0 para SHADOW."], highlights: ["Quick Win 4: fábrica de conteúdo com três agentes principais."] },
      { month: 5, label: "Aquisição", title: "Tráfego e vídeo", items: ["Criar campanha Meta com criativo e público.", "Cortar vídeos longos em vídeos curtos.", "Manter Veo 3 premium fora até caber no custo."], highlights: ["Quick Win 5: marketing passa a testar aquisição com custo controlado."] },
      { month: 6, label: "Escala", title: "Estratégia, DM e auditoria", items: ["Gerar diagnóstico de funil pelo estrategista.", "Testar DM apenas interno por LGPD.", "Rodar auditoria mensal e medir ROI."], highlights: ["Quick Win 6: esteira de marketing agentic pronta para escala."] },
    ],
  },
  {
    projectKey: "multi-agentes",
    title: "Multi-Agentes",
    completedThrough: 2,
    currentWeek: 3,
    phases: [
      { name: "Quick Wins & Alinhamento", description: "Gerar valor visível rápido: construir a Fábrica que cria agentes a partir de uma receita, com governança e segurança automáticas.", color: "green", startMonth: 1, endMonth: 2 },
      { name: "Construção da Base", description: "Colocar as guildas de governança, engenharia, qualidade e segurança para a Fábrica produzir agentes sozinha, com portões de aprovação.", color: "blue", startMonth: 3, endMonth: 4 },
      { name: "Inteligência Avançada", description: "Fabricar a frota de 150+ agentes em modo sombra, povoar o Company Brain e ligar o painel do operador.", color: "blue", startMonth: 5, endMonth: 5 },
      { name: "Validação & Escala", description: "Vender o diagnóstico ao primeiro cliente real, promover agentes por portão e medir receita, custo e qualidade.", color: "amber", startMonth: 6, endMonth: 6 },
    ],
    months: [
      { month: 1, label: "Quick Win", title: "Plataforma que fabrica agentes", items: ["Definir a constituição que todo agente deve obedecer (regras auditáveis).", "Criar o Company Brain: tudo que um agente faz vira registro rastreável.", "Ligar o motor que cria, testa e promove agentes a partir de uma receita."], highlights: ["Quick Win 1: um agente passa por todo o fluxo (criar → agir → aprovar → registrar) em modo sombra."] },
      { month: 2, label: "Quick Win", title: "Venda e ativação ponta a ponta", items: ["Diagnosticar a empresa do cliente e ligar o time de agentes na conta dele.", "Garantir que cada cliente fica isolado (multi-cliente seguro).", "Rodar 5 agentes de gestão (caixa, triagem, operações, atendimento, painel do dono)."], highlights: ["Quick Win 2: 16 demonstrações completas de venda → ativação rodando ponta a ponta."] },
      { month: 3, label: "Fábrica", title: "Agentes que fazem agentes", items: ["Montar as guildas de governança, engenharia, qualidade e segurança.", "Escrever as receitas (specs) e os casos de teste dos agentes de negócio.", "Deixar a Fábrica materializar agentes em paralelo, sem humano escrever código."], highlights: ["Quick Win 3: a Fábrica recebe uma receita nova e entrega um agente em modo sombra sozinha."] },
      { month: 4, label: "Frota", title: "150+ agentes em modo sombra", items: ["Instanciar a frota completa de agentes, cada um com testes próprios.", "Todo agente nasce observando: sugere, mas ainda não age nem cobra.", "Garantir trilha de auditoria e supervisor-raiz roteando as guildas."], highlights: ["Quick Win 4: frota de 150+ agentes de pé, todos rastreáveis e em modo seguro."] },
      { month: 5, label: "Brain", title: "Inteligência e painel do operador", items: ["Rodar em sombra os agentes do caminho-crítico e medir a taxa de acerto.", "Povoar o Company Brain para a empresa ficar consultável.", "Ligar o Operator Console com receita, custo e qualidade ao vivo."], highlights: ["Quick Win 5: o dono enxerga, num só painel, o que cada agente faria e quanto custaria."] },
      { month: 6, label: "Go-Live", title: "Primeiro cliente e promoção por portão", items: ["Vender o diagnóstico pago para o primeiro fundador-bombeiro em SP.", "Promover por portão os agentes que provam qualidade (piloto → assistido → autônomo).", "Travar a margem dos agentes cobráveis e agendar a auditoria mensal."], highlights: ["Quick Win 6: produto no ar operado pela frota, com o primeiro sinal real de valor e de preço."] },
    ],
  },
];

export function getProjectRoadmapTemplate(projectKeyOrName: string) {
  const key = projectKeyOrName.toLowerCase();
  return projectRoadmapTemplates.find((template) => template.projectKey === key || template.title.toLowerCase() === key);
}
