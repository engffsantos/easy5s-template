import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertTriangle, XCircle, Upload, Send } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { mockCorrectiveActions, mockEnvironments, mockEmployees, pillarNames } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { format, isAfter } from 'date-fns';

const CorrectiveActions: React.FC = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [observation, setObservation] = useState('');
  
  const getStatusColor = (status: string, deadlineDate: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (isAfter(new Date(), new Date(deadlineDate))) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string, deadlineDate: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4" />;
    if (isAfter(new Date(), new Date(deadlineDate))) return <XCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (actionId: string) => {
    if (!selectedImage || !observation.trim()) return;

    // In a real app, this would be an API call
    console.log('Submitting response:', {
      actionId,
      observation,
      image: selectedImage,
    });

    // Reset form
    setSelectedImage(null);
    setObservation('');
  };

  return (
    <div className="page-container">
      <h1 className="page-title mb-8">Ações Corretivas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCorrectiveActions.map(action => {
          const environment = mockEnvironments.find(env => env.id === action.environmentId);
          const employee = mockEmployees.find(emp => emp.id === action.employeeId);
          const isResponsible = user?.id === action.employeeId;
          const canRespond = isResponsible && action.status !== 'completed';
          const isOverdue = isAfter(new Date(), new Date(action.deadlineDate));

          return (
            <Card key={action.id} className="overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{environment?.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Bloco {environment?.block}
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  getStatusColor(action.status, action.deadlineDate)
                }`}>
                  {getStatusIcon(action.status, action.deadlineDate)}
                  <span className="ml-2">
                    {action.status === 'completed' ? 'Concluída' : 
                     isOverdue ? 'Atrasada' : 'Pendente'}
                  </span>
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição do Problema</h3>
                  <p className="text-gray-600">{action.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Prazo</h4>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="capitalize">{action.deadlineType}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Data Limite</h4>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {format(new Date(action.deadlineDate), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Responsável</h4>
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-1 text-gray-400" />
                    {employee?.fullName}
                  </div>
                </div>

                {action.status === 'completed' && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Resposta</h4>
                      <p className="text-gray-600">{action.observation}</p>
                    </div>
                    {action.proofImageUrl && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Evidência</h4>
                        <img 
                          src={action.proofImageUrl} 
                          alt="Evidência" 
                          className="rounded-lg w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {canRespond && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="form-label">Observação da Ação Tomada</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Descreva as ações tomadas para resolver o problema..."
                      />
                    </div>

                    <div>
                      <label className="form-label">Evidência (Foto)</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                              <span>Fazer upload de arquivo</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={<Send className="w-4 h-4" />}
                      disabled={!selectedImage || !observation.trim()}
                      onClick={() => handleSubmit(action.id)}
                    >
                      Enviar Resposta
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CorrectiveActions;