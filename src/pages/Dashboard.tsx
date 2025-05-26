import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Calendar, Clipboard, ListChecks, Users } from 'lucide-react';
import Card from '../components/common/Card';
import PillarChart from '../components/charts/PillarChart';
import EnvironmentScoreChart from '../components/charts/EnvironmentScoreChart';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { mockEvaluations, mockEnvironments, getAveragePillarScores } from '../data/mockData';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate stats
  const stats = useMemo(() => {
    // Latest evaluations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEvaluations = mockEvaluations.filter(
      evaluation => new Date(evaluation.date) >= thirtyDaysAgo
    );
    
    // Calculate average scores by environment
    const environmentScores = mockEnvironments.map(env => {
      const envEvaluations = mockEvaluations.filter(evaluation => evaluation.environmentId === env.id);
      let score = 0;
      
      if (envEvaluations.length > 0) {
        score = envEvaluations.reduce((sum, evaluation) => sum + (evaluation.averageScore || 0), 0) / envEvaluations.length;
      }
      
      return {
        id: env.id,
        name: env.name,
        score,
      };
    }).sort((a, b) => b.score - a.score);
    
    // Get latest evaluation for pillar chart
    const latestEvaluation = mockEvaluations.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    const pillarScores = latestEvaluation ? getAveragePillarScores(latestEvaluation) : [];
    
    return {
      totalEnvironments: mockEnvironments.length,
      totalEvaluations: mockEvaluations.length,
      recentEvaluations: recentEvaluations.length,
      averageScore: mockEvaluations.reduce((sum, evaluation) => sum + (evaluation.averageScore || 0), 0) / mockEvaluations.length,
      environmentScores,
      pillarScores,
      latestEnvironment: latestEvaluation 
        ? mockEnvironments.find(env => env.id === latestEvaluation.environmentId)?.name 
        : null,
    };
  }, []);

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="page-title mb-2 sm:mb-0">Dashboard</h1>
        {user?.role !== 'student' && (
          <div className="flex space-x-3">
            <Link to="/evaluations/new">
              <Button 
                variant="primary" 
                leftIcon={<Clipboard className="h-4 w-4" />}
              >
                Nova Avaliação
              </Button>
            </Link>
            <Link to="/calendar">
              <Button 
                variant="outline" 
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Agendar Vistoria
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Média Geral</h3>
            <div className="flex items-center text-success-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-xs">2%</span>
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{stats.averageScore.toFixed(1)}</span>
            <span className="text-lg text-gray-500 ml-1">/5</span>
          </div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total de Avaliações</h3>
            <div className="flex items-center text-success-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-xs">5%</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{stats.totalEvaluations}</span>
          </div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avaliações Recentes</h3>
            <div className="flex items-center text-error-500">
              <ArrowDown className="h-4 w-4 mr-1" />
              <span className="text-xs">3%</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{stats.recentEvaluations}</span>
            <span className="text-sm text-gray-500 ml-2">/ último mês</span>
          </div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Ambientes</h3>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{stats.totalEnvironments}</span>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Última Avaliação por Pilar" className="lg:col-span-1">
          {stats.latestEnvironment && (
            <div className="mb-3 text-sm text-gray-500">
              Ambiente: <span className="font-medium text-gray-700">{stats.latestEnvironment}</span>
            </div>
          )}
          
          {stats.pillarScores.length > 0 ? (
            <PillarChart scores={stats.pillarScores} height={280} />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              Nenhuma avaliação encontrada
            </div>
          )}
        </Card>
        
        <Card title="Pontuação por Ambiente" className="lg:col-span-2">
          <div className="mb-4 text-sm text-gray-500">
            Comparativo de notas médias entre os ambientes avaliados
          </div>
          
          {stats.environmentScores.length > 0 ? (
            <EnvironmentScoreChart 
              environments={stats.environmentScores.slice(0, 6)} 
              height={260} 
            />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              Nenhum ambiente avaliado
            </div>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Acesso Rápido" className="md:col-span-1">
          <div className="space-y-3">
            <Link to="/environments" className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <ListChecks className="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <div className="font-medium">Ambientes</div>
                <div className="text-sm text-gray-500">Gerenciar e visualizar ambientes</div>
              </div>
            </Link>
            
            <Link to="/evaluations" className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <Clipboard className="h-5 w-5 text-secondary-500 mr-3" />
              <div>
                <div className="font-medium">Avaliações</div>
                <div className="text-sm text-gray-500">Ver histórico de avaliações</div>
              </div>
            </Link>
            
            <Link to="/calendar" className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <Calendar className="h-5 w-5 text-accent-500 mr-3" />
              <div>
                <div className="font-medium">Calendário</div>
                <div className="text-sm text-gray-500">Agendar e ver vistorias</div>
              </div>
            </Link>
            
            {user?.role === 'manager' && (
              <Link to="/users" className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-gray-700 mr-3" />
                <div>
                  <div className="font-medium">Usuários</div>
                  <div className="text-sm text-gray-500">Gerenciar usuários do sistema</div>
                </div>
              </Link>
            )}
          </div>
        </Card>
        
        <Card title="Ranking de Ambientes" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ambiente
                  </th>
                  <th className="pb-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nota Média
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.environmentScores.slice(0, 5).map((env, index) => (
                  <tr key={env.id} className="hover:bg-gray-50">
                    <td className="py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{env.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 whitespace-nowrap text-center">
                      <div className="text-sm font-medium">{env.score.toFixed(1)}</div>
                    </td>
                    <td className="py-3 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        env.score >= 4 
                          ? 'bg-green-100 text-green-800' 
                          : env.score >= 3
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {env.score >= 4 
                          ? 'Ótimo' 
                          : env.score >= 3
                            ? 'Regular'
                            : 'Crítico'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {stats.environmentScores.length > 5 && (
            <div className="mt-4 text-center">
              <Link to="/environments">
                <Button variant="outline" size="sm">
                  Ver todos os ambientes
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;