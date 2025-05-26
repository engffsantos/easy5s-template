import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, Calendar, ChevronDown, Clock, MapPin, User } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { mockEvaluations, mockEnvironments, mockUsers, mockQuestions, getAveragePillarScores } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import PillarChart from '../components/charts/PillarChart';

const Evaluations: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [selectedInspector, setSelectedInspector] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [expandedEvaluation, setExpandedEvaluation] = useState<string | null>(null);
  
  // Filter evaluations
  const filteredEvaluations = mockEvaluations.filter(evaluation => {
    const environment = mockEnvironments.find(env => env.id === evaluation.environmentId);
    const inspector = mockUsers.find(user => user.id === evaluation.inspectorId);
    
    const matchesSearch = environment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspector?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = selectedEnvironment === 'all' || evaluation.environmentId === selectedEnvironment;
    const matchesInspector = selectedInspector === 'all' || evaluation.inspectorId === selectedInspector;
    const matchesDate = (!dateRange.start || evaluation.date >= dateRange.start) &&
      (!dateRange.end || evaluation.date <= dateRange.end);
    
    return matchesSearch && matchesEnvironment && matchesInspector && matchesDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const toggleExpand = (id: string) => {
    setExpandedEvaluation(expandedEvaluation === id ? null : id);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="page-title mb-2">Avaliações</h1>
          <p className="text-gray-600">
            {filteredEvaluations.length} {filteredEvaluations.length === 1 ? 'avaliação encontrada' : 'avaliações encontradas'}
          </p>
        </div>
        
        {user?.role !== 'student' && (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Link to="/evaluations/new">
              <Button variant="primary">
                Nova Avaliação
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>
                Ver Calendário
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="form-label">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="form-input pl-10"
                placeholder="Buscar avaliações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="environment" className="form-label">Ambiente</label>
            <select
              id="environment"
              className="form-select"
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
            >
              <option value="all">Todos os ambientes</option>
              {mockEnvironments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="inspector" className="form-label">Avaliador</label>
            <select
              id="inspector"
              className="form-select"
              value={selectedInspector}
              onChange={(e) => setSelectedInspector(e.target.value)}
            >
              <option value="all">Todos os avaliadores</option>
              {mockUsers
                .filter(user => user.role === 'inspector')
                .map(inspector => (
                  <option key={inspector.id} value={inspector.id}>{inspector.name}</option>
                ))
              }
            </select>
          </div>
          
          <div>
            <label htmlFor="dateRange" className="form-label">Período</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="form-input"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <input
                type="date"
                className="form-input"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        {filteredEvaluations.map(evaluation => {
          const environment = mockEnvironments.find(env => env.id === evaluation.environmentId);
          const inspector = mockUsers.find(user => user.id === evaluation.inspectorId);
          const pillarScores = getAveragePillarScores(evaluation);
          const isExpanded = expandedEvaluation === evaluation.id;
          
          return (
            <Card 
              key={evaluation.id} 
              className={`transition-all duration-300 ${
                isExpanded ? 'shadow-elevated' : 'hover:shadow-elevated'
              }`}
            >
              <div 
                className="flex flex-col md:flex-row md:items-center cursor-pointer"
                onClick={() => toggleExpand(evaluation.id)}
              >
                <div className="flex-1">
                  <div className="flex items-start md:items-center flex-col md:flex-row md:space-x-4">
                    <div className="flex items-center space-x-2 mb-2 md:mb-0">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <h3 className="text-lg font-semibold">{environment?.name}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {inspector?.name}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(evaluation.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  <div className="flex items-baseline mr-6">
                    <span className={`text-2xl font-bold ${getScoreColor(evaluation.averageScore || 0)}`}>
                      {evaluation.averageScore?.toFixed(1)}
                    </span>
                    <span className="text-gray-400 ml-1">/5</span>
                  </div>
                  
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-6 pt-6 border-t animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4">
                        Pontuação por Pilar
                      </h4>
                      <PillarChart scores={pillarScores} height={250} />
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">
                          Observações
                        </h4>
                        <div className="space-y-4">
                          {evaluation.answers
                            .filter(answer => answer.observation)
                            .map(answer => {
                              const question = mockQuestions.find(q => q.id === answer.questionId);
                              return (
                                <div 
                                  key={answer.questionId} 
                                  className="bg-gray-50 rounded-lg p-4"
                                >
                                  <p className="font-medium text-sm mb-2">{question?.text}</p>
                                  <p className="text-gray-600 text-sm">{answer.observation}</p>
                                  <div className="flex items-center mt-2">
                                    <div className={`text-sm font-medium ${getScoreColor(answer.score)}`}>
                                      Nota: {answer.score}/5
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Exportar PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        
        {filteredEvaluations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <div className="text-gray-400 mb-3">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nenhuma avaliação encontrada
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluations;