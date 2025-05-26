import { User, Environment, Question, Evaluation, ScheduledEvaluation, SPillar, Employee, EnvironmentEmployee, CorrectiveAction } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Manager',
    email: 'admin@senai.com',
    role: 'manager',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Inspector Silva',
    email: 'inspector@senai.com',
    role: 'inspector',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@senai.com',
    role: 'student',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

// Mock Environments
export const mockEnvironments: Environment[] = [
  {
    id: '1',
    name: 'Sala 101',
    type: 'classroom',
    block: 'A',
    description: 'Sala de aula padrão com 30 carteiras',
    isActive: true,
  },
  {
    id: '2',
    name: 'Laboratório de Informática',
    type: 'laboratory',
    block: 'B',
    description: 'Laboratório com 20 computadores',
    isActive: true,
  },
  {
    id: '3',
    name: 'Oficina Mecânica',
    type: 'workshop',
    block: 'C',
    description: 'Oficina para práticas mecânicas',
    isActive: true,
  },
  {
    id: '4',
    name: 'Sala 205',
    type: 'classroom',
    block: 'A',
    description: 'Sala de aula para 25 alunos',
    isActive: true,
  },
  {
    id: '5',
    name: 'Laboratório de Química',
    type: 'laboratory',
    block: 'B',
    description: 'Laboratório para experimentos químicos',
    isActive: true,
  },
];

// Mock Questions
let mockQuestions: Question[] = [
  // Seiri (Sort) - General questions
  {
    id: '1',
    text: 'Há materiais desnecessários no ambiente?',
    pillar: 'seiri',
    scope: 'general',
  },
  {
    id: '2',
    text: 'Existem equipamentos sem uso ocupando espaço?',
    pillar: 'seiri',
    scope: 'general',
  },
  
  // Seiton (Set in Order) - General questions
  {
    id: '3',
    text: 'Os itens estão organizados de forma lógica?',
    pillar: 'seiton',
    scope: 'general',
  },
  {
    id: '4',
    text: 'Materiais de uso frequente estão de fácil acesso?',
    pillar: 'seiton',
    scope: 'general',
  },
  
  // Seiso (Shine) - General questions
  {
    id: '5',
    text: 'O ambiente está limpo e sem poeira?',
    pillar: 'seiso',
    scope: 'general',
  },
  {
    id: '6',
    text: 'Os equipamentos estão em bom estado de conservação?',
    pillar: 'seiso',
    scope: 'general',
  },
  
  // Seiketsu (Standardize) - General questions
  {
    id: '7',
    text: 'Existem procedimentos padronizados visíveis?',
    pillar: 'seiketsu',
    scope: 'general',
  },
  {
    id: '8',
    text: 'As normas de segurança estão sendo seguidas?',
    pillar: 'seiketsu',
    scope: 'general',
  },
  
  // Shitsuke (Sustain) - General questions
  {
    id: '9',
    text: 'Os alunos/funcionários mantêm a disciplina dos 4S anteriores?',
    pillar: 'shitsuke',
    scope: 'general',
  },
  {
    id: '10',
    text: 'Há evidências de melhoria contínua no ambiente?',
    pillar: 'shitsuke',
    scope: 'general',
  },
  
  // Laboratory specific questions
  {
    id: '11',
    text: 'Os equipamentos de laboratório estão guardados adequadamente?',
    pillar: 'seiton',
    scope: 'type',
    targetId: 'laboratory',
  },
  {
    id: '12',
    text: 'Produtos químicos estão devidamente identificados e armazenados?',
    pillar: 'seiketsu',
    scope: 'type',
    targetId: 'laboratory',
  },
];

// Export function to update questions
export const updateMockQuestions = (newQuestions: Question[]) => {
  mockQuestions = newQuestions;
};

// Export function to get questions
export const getMockQuestions = () => mockQuestions;

// Mock Evaluations
export const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    environmentId: '1',
    inspectorId: '2',
    date: '2024-05-01',
    status: 'completed',
    averageScore: 4.2,
    answers: [
      { questionId: '1', score: 4, observation: 'Poucos materiais desnecessários.' },
      { questionId: '2', score: 3, observation: 'Alguns equipamentos obsoletos.' },
      { questionId: '3', score: 5, observation: 'Excelente organização.' },
      { questionId: '4', score: 4, observation: 'Boa acessibilidade.' },
      { questionId: '5', score: 5, observation: 'Ambiente muito limpo.' },
      { questionId: '6', score: 4, observation: 'Equipamentos bem conservados.' },
      { questionId: '7', score: 4, observation: 'Procedimentos visíveis.' },
      { questionId: '8', score: 5, observation: 'Todas as normas seguidas.' },
      { questionId: '9', score: 4, observation: 'Boa disciplina geral.' },
      { questionId: '10', score: 4, observation: 'Evidências de melhorias.' },
    ],
  },
  {
    id: '2',
    environmentId: '2',
    inspectorId: '2',
    date: '2024-05-03',
    status: 'completed',
    averageScore: 3.8,
    answers: [
      { questionId: '1', score: 3, observation: 'Alguns materiais desnecessários.' },
      { questionId: '2', score: 3, observation: 'Equipamentos extras.' },
      { questionId: '3', score: 4, observation: 'Boa organização.' },
      { questionId: '4', score: 4, observation: 'Materiais acessíveis.' },
      { questionId: '5', score: 4, observation: 'Ambiente limpo.' },
      { questionId: '6', score: 4, observation: 'Equipamentos conservados.' },
      { questionId: '7', score: 3, observation: 'Alguns procedimentos visíveis.' },
      { questionId: '8', score: 5, observation: 'Normas seguidas rigorosamente.' },
      { questionId: '9', score: 4, observation: 'Disciplina mantida.' },
      { questionId: '10', score: 4, observation: 'Melhorias implementadas.' },
      { questionId: '11', score: 3, observation: 'Equipamentos parcialmente organizados.' },
      { questionId: '12', score: 4, observation: 'Produtos bem identificados.' },
    ],
  },
  {
    id: '3',
    environmentId: '3',
    inspectorId: '2',
    date: '2024-05-05',
    status: 'completed',
    averageScore: 3.5,
    answers: [
      { questionId: '1', score: 2, observation: 'Muitos materiais desnecessários.' },
      { questionId: '2', score: 3, observation: 'Alguns equipamentos sem uso.' },
      { questionId: '3', score: 4, observation: 'Organização adequada.' },
      { questionId: '4', score: 4, observation: 'Acesso fácil aos materiais comuns.' },
      { questionId: '5', score: 3, observation: 'Ambiente razoavelmente limpo.' },
      { questionId: '6', score: 4, observation: 'Equipamentos em bom estado.' },
      { questionId: '7', score: 3, observation: 'Procedimentos parciais.' },
      { questionId: '8', score: 5, observation: 'Normas de segurança seguidas.' },
      { questionId: '9', score: 3, observation: 'Disciplina média.' },
      { questionId: '10', score: 4, observation: 'Algumas melhorias visíveis.' },
    ],
  },
];

// Mock Scheduled Evaluations
export const mockScheduledEvaluations: ScheduledEvaluation[] = [
  {
    id: '1',
    environmentId: '1',
    inspectorId: '2',
    scheduledDate: '2024-06-15',
    status: 'scheduled',
  },
  {
    id: '2',
    environmentId: '2',
    inspectorId: '2',
    scheduledDate: '2024-06-20',
    status: 'scheduled',
  },
  {
    id: '3',
    environmentId: '3',
    inspectorId: '2',
    scheduledDate: '2024-05-05', // past date
    status: 'completed',
    evaluationId: '3',
  },
  {
    id: '4',
    environmentId: '4',
    inspectorId: '2',
    scheduledDate: '2024-06-25',
    status: 'scheduled',
  },
  {
    id: '5',
    environmentId: '5',
    inspectorId: '2',
    scheduledDate: '2024-06-30',
    status: 'scheduled',
  },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'João Silva',
    email: 'joao.silva@senai.com',
    role: 'responsible',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    fullName: 'Maria Santos',
    email: 'maria.santos@senai.com',
    role: 'inspector',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    fullName: 'Pedro Oliveira',
    email: 'pedro.oliveira@senai.com',
    role: 'manager',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    fullName: 'Ana Costa',
    email: 'ana.costa@senai.com',
    role: 'student',
    createdAt: '2024-02-15',
  },
];

// Mock Environment Employees
export const mockEnvironmentEmployees: EnvironmentEmployee[] = [
  { environmentId: '1', employeeId: '1' },
  { environmentId: '1', employeeId: '2' },
  { environmentId: '2', employeeId: '2' },
  { environmentId: '3', employeeId: '3' },
];

// Mock Corrective Actions
export const mockCorrectiveActions: CorrectiveAction[] = [
  {
    id: '1',
    description: 'Organizar materiais acumulados no fundo da sala',
    deadlineType: 'short',
    status: 'pending',
    deadlineDate: '2024-05-30',
    environmentId: '1',
    employeeId: '1',
    evaluationId: '1',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-01',
  },
  {
    id: '2',
    description: 'Atualizar procedimentos de segurança do laboratório',
    deadlineType: 'medium',
    status: 'in_progress',
    observation: 'Em processo de revisão com a equipe técnica',
    deadlineDate: '2024-06-15',
    environmentId: '2',
    employeeId: '2',
    evaluationId: '2',
    createdAt: '2024-05-03',
    updatedAt: '2024-05-10',
  },
  {
    id: '3',
    description: 'Substituir equipamentos obsoletos da oficina',
    deadlineType: 'long',
    status: 'completed',
    proofImageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
    observation: 'Equipamentos substituídos e instalados',
    deadlineDate: '2024-07-30',
    environmentId: '3',
    employeeId: '3',
    evaluationId: '3',
    createdAt: '2024-05-05',
    updatedAt: '2024-05-20',
  },
];

// Function to get pillar scores from an evaluation
export function getPillarScores(evaluation: Evaluation): Record<SPillar, { score: number; count: number }> {
  const pillarScores = {
    seiri: { score: 0, count: 0 },
    seiton: { score: 0, count: 0 },
    seiso: { score: 0, count: 0 },
    seiketsu: { score: 0, count: 0 },
    shitsuke: { score: 0, count: 0 },
  };

  // Fill in scores by pillar
  evaluation.answers.forEach(answer => {
    const question = getMockQuestions().find(q => q.id === answer.questionId);
    if (question) {
      pillarScores[question.pillar].score += answer.score;
      pillarScores[question.pillar].count += 1;
    }
  });

  return pillarScores;
}

// Function to get average score for each pillar
export function getAveragePillarScores(evaluation: Evaluation) {
  const pillarScores = getPillarScores(evaluation);
  
  return Object.entries(pillarScores).map(([pillar, data]) => ({
    pillar: pillar as SPillar,
    score: data.count > 0 ? Math.round((data.score / data.count) * 10) / 10 : 0,
  }));
}

// Mapping for pillar names in Portuguese
export const pillarNames: Record<SPillar, string> = {
  seiri: 'Seiri (Utilização)',
  seiton: 'Seiton (Organização)',
  seiso: 'Seisō (Limpeza)',
  seiketsu: 'Seiketsu (Padronização)',
  shitsuke: 'Shitsuke (Disciplina)',
};

// Pillar descriptions
export const pillarDescriptions: Record<SPillar, string> = {
  seiri: 'Separar o necessário do desnecessário e eliminar o que não é preciso.',
  seiton: 'Organizar os itens necessários de forma que sejam fáceis de encontrar, usar e guardar.',
  seiso: 'Manter o ambiente limpo e eliminar as causas da sujeira.',
  seiketsu: 'Estabelecer procedimentos padrão e garantir que todos os sigam.',
  shitsuke: 'Manter a disciplina para sustentar os outros pilares, melhorando continuamente.',
};

// Colors for the pillars
export const pillarColors: Record<SPillar, string> = {
  seiri: '#FF8200', // Orange
  seiton: '#0056A4', // Blue
  seiso: '#00A651', // Green
  seiketsu: '#7030A0', // Purple
  shitsuke: '#FFD100', // Yellow
};

export { mockQuestions }