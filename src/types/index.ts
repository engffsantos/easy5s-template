import React from 'react';

export type UserRole = 'manager' | 'inspector' | 'student' | 'responsible';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type EnvironmentType = 'classroom' | 'laboratory' | 'office' | 'workshop' | 'other';

export interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  block: string;
  description: string;
  isActive: boolean;
}

export type QuestionScope = 'general' | 'type' | 'block' | 'environment';
export type SPillar = 'seiri' | 'seiton' | 'seiso' | 'seiketsu' | 'shitsuke';

export interface Question {
  id: string;
  text: string;
  pillar: SPillar;
  scope: QuestionScope;
  targetId?: string; // ID of type, block, or environment if scope is specific
}

export interface Answer {
  questionId: string;
  score: number; // 0-5
  observation?: string;
  imageUrls?: string[];
}

export interface Evaluation {
  id: string;
  environmentId: string;
  inspectorId: string;
  date: string;
  answers: Answer[];
  status: 'draft' | 'completed';
  averageScore?: number;
}

export interface ScheduledEvaluation {
  id: string;
  environmentId: string;
  inspectorId: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'canceled';
  evaluationId?: string;
}

export interface PillarScore {
  pillar: SPillar;
  score: number;
}

export interface EnvironmentScore {
  environmentId: string;
  environmentName: string;
  averageScore: number;
  pillarScores: PillarScore[];
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface NewEmployeeData {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export interface EnvironmentEmployee {
  environmentId: string;
  employeeId: string;
}

export type DeadlineType = 'short' | 'medium' | 'long';
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface CorrectiveAction {
  id: string;
  description: string;
  deadlineType: DeadlineType;
  status: ActionStatus;
  proofImageUrl?: string;
  observation?: string;
  deadlineDate: string;
  environmentId: string;
  employeeId: string;
  evaluationId: string;
  createdAt: string;
  updatedAt: string;
}