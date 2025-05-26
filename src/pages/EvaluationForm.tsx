import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ChevronRight, ChevronLeft, Camera, X, Settings } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ManageQuestionsModal from '../components/modals/ManageQuestionsModal';
import { useAuth } from '../contexts/AuthContext';
import { mockEnvironments, getMockQuestions, updateMockQuestions, pillarNames, pillarDescriptions } from '../data/mockData';
import { SPillar, Question, Answer } from '../types';

const pillars: SPillar[] = ['seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'];

const EvaluationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  
  // Helper to get questions by pillar
  const getQuestionsByPillar = (pillar: SPillar): Question[] => {
    return getMockQuestions().filter(q => q.pillar === pillar);
  };
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], score };
        return updated;
      }
      
      return [...prev, { questionId, score }];
    });
  };
  
  // Handle observation change
  const handleObservationChange = (questionId: string, observation: string) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], observation };
        return updated;
      }
      
      return [...prev, { questionId, score: 0, observation }];
    });
  };
  
  // Handle form submit
  const handleSubmit = async () => {
    if (!selectedEnvironmentId || !user) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to save the evaluation
      console.log({
        environmentId: selectedEnvironmentId,
        inspectorId: user.id,
        date: new Date().toISOString().split('T')[0],
        answers,
        status: 'completed',
      });
      
      // Navigate to evaluations list
      navigate('/evaluations');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle questions update
  const handleQuestionsUpdate = (updatedQuestions: Question[]) => {
    updateMockQuestions(updatedQuestions);
    setIsQuestionsModalOpen(false);
  };
  
  // Calculate if we can go next (environment selected or all questions in step answered)
  const canGoNext = () => {
    if (currentStep === 0) {
      return selectedEnvironmentId !== '';
    }
    
    const pillar = pillars[currentStep - 1];
    const questions = getQuestionsByPillar(pillar);
    const answeredCount = questions.filter(q => 
      answers.some(a => a.questionId === q.id && a.score > 0)
    ).length;
    
    return answeredCount === questions.length;
  };
  
  // Go to next step
  const goToNextStep = () => {
    if (canGoNext() && currentStep < pillars.length + 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Render progress tracker
  const renderProgressTracker = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex">
            {Array.from({ length: pillars.length + 2 }).map((_, index) => (
              <React.Fragment key={index}>
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  ${currentStep >= index 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-400'}
                  ${index === 0 ? 'mr-1' : index === pillars.length + 1 ? 'ml-1' : 'mx-1'}
                `}>
                  {index === 0 ? (
                    '1'
                  ) : index === pillars.length + 1 ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                {index < pillars.length + 1 && (
                  <div className={`
                    flex-1 h-1 
                    ${currentStep > index ? 'bg-primary-500' : 'bg-gray-200'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div>Ambiente</div>
          {pillars.map((pillar, index) => (
            <div key={pillar}>{index + 2}S</div>
          ))}
          <div>Finalizar</div>
        </div>
      </div>
    );
  };
  
  // Render environment selection
  const renderEnvironmentSelection = () => {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Selecione o Ambiente</h2>
          {user?.role === 'manager' && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Settings className="h-4 w-4" />}
              onClick={() => setIsQuestionsModalOpen(true)}
            >
              Gerenciar Questões
            </Button>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="environment" className="form-label">
            Ambiente a ser avaliado
          </label>
          <select
            id="environment"
            value={selectedEnvironmentId}
            onChange={(e) => setSelectedEnvironmentId(e.target.value)}
            className="form-select"
          >
            <option value="">Selecione um ambiente...</option>
            {mockEnvironments.filter(env => env.isActive).map(env => (
              <option key={env.id} value={env.id}>
                {env.name} (Bloco {env.block})
              </option>
            ))}
          </select>
        </div>
        
        {selectedEnvironmentId && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Detalhes do Ambiente</h3>
            <div className="text-sm">
              {(() => {
                const env = mockEnvironments.find(e => e.id === selectedEnvironmentId);
                if (!env) return null;
                
                return (
                  <>
                    <p><span className="font-medium">Nome:</span> {env.name}</p>
                    <p><span className="font-medium">Tipo:</span> {env.type}</p>
                    <p><span className="font-medium">Bloco:</span> {env.block}</p>
                    <p><span className="font-medium">Descrição:</span> {env.description}</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render pillar questions
  const renderPillarQuestions = (pillar: SPillar) => {
    const questions = getQuestionsByPillar(pillar);
    
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {pillarNames[pillar]}
          </h2>
          <p className="text-gray-600 mt-1">
            {pillarDescriptions[pillar]}
          </p>
        </div>
        
        <div className="space-y-6">
          {questions.map(question => {
            const answer = answers.find(a => a.questionId === question.id) || { score: 0 };
            
            return (
              <Card key={question.id} className="transition-all duration-200 hover:shadow-elevated">
                <div className="mb-3">
                  <h3 className="font-medium">{question.text}</h3>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Pontuação (0-5)</label>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleAnswerChange(question.id, score)}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${answer.score === score 
                            ? score === 0 
                              ? 'bg-gray-700 text-white' 
                              : score <= 2 
                                ? 'bg-red-500 text-white' 
                                : score <= 3 
                                  ? 'bg-yellow-500 text-white' 
                                  : 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                          transition-colors font-medium
                        `}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor={`observation-${question.id}`} className="form-label">
                    Observações
                  </label>
                  <textarea
                    id={`observation-${question.id}`}
                    rows={2}
                    value={answer.observation || ''}
                    onChange={(e) => handleObservationChange(question.id, e.target.value)}
                    className="form-input"
                    placeholder="Observações opcionais"
                  />
                </div>
                
                <div className="mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600"
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    Adicionar Foto
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render confirmation
  const renderConfirmation = () => {
    // Calculate stats
    const totalQuestions = getMockQuestions().length;
    const answeredQuestions = answers.filter(a => a.score > 0).length;
    const averageScore = answers.reduce((sum, a) => sum + a.score, 0) / answers.length || 0;
    
    // Get environment info
    const environment = mockEnvironments.find(e => e.id === selectedEnvironmentId);
    
    return (
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Confirmar Avaliação</h2>
        
        <Card className="mb-6">
          <h3 className="font-medium mb-3">Resumo da Avaliação</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Ambiente:</span>
              <span className="font-medium">{environment?.name}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Data:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Avaliador:</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-600">Questões respondidas:</span>
              <span className="font-medium">{answeredQuestions} de {totalQuestions}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Nota média:</span>
              <span className={`font-medium ${
                averageScore >= 4 
                  ? 'text-green-600' 
                  : averageScore >= 3 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
              }`}>
                {averageScore.toFixed(1)} / 5
              </span>
            </div>
          </div>
        </Card>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">Atenção</h3>
          <p className="text-sm text-yellow-700">
            Ao confirmar, você está certificando que as informações fornecidas são verdadeiras e que a avaliação foi realizada conforme as diretrizes do programa 5S.
          
          </p>
        </div>
        
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          onClick={handleSubmit}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Finalizar Avaliação
        </Button>
      </div>
    );
  };
  
  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Nova Avaliação 5S</h1>
      </div>
      
      {renderProgressTracker()}
      
      {currentStep === 0 && renderEnvironmentSelection()}
      
      {currentStep > 0 && currentStep <= pillars.length && renderPillarQuestions(pillars[currentStep - 1])}
      
      {currentStep === pillars.length + 1 && renderConfirmation()}
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Anterior
        </Button>
        
        {currentStep < pillars.length + 1 ? (
          <Button
            variant="primary"
            onClick={goToNextStep}
            disabled={!canGoNext()}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Próximo
          </Button>
        ) : null}
      </div>

      <ManageQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        onSave={handleQuestionsUpdate}
        existingQuestions={getMockQuestions()}
      />
    </div>
  );
};

export default EvaluationForm;