import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import NewEnvironmentModal from '../components/modals/NewEnvironmentModal';
import { mockEnvironments, mockEmployees, mockEnvironmentEmployees } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Environment, EnvironmentType } from '../types';

const environmentTypes: Record<EnvironmentType, string> = {
  classroom: 'Sala de Aula',
  laboratory: 'Laboratório',
  office: 'Escritório',
  workshop: 'Oficina',
  other: 'Outro',
};

const Environments: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<EnvironmentType | 'all'>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);
  
  // Get unique blocks from environments
  const blocks = Array.from(new Set(mockEnvironments.map(env => env.block))).sort();
  
  // Filter environments based on search and filters
  const filteredEnvironments = mockEnvironments.filter(env => {
    const matchesSearch = env.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      env.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || env.type === selectedType;
    const matchesBlock = selectedBlock === 'all' || env.block === selectedBlock;
    
    return matchesSearch && matchesType && matchesBlock;
  });

  const handleCreateEnvironment = (environmentData: {
    name: string;
    type: EnvironmentType;
    block: string;
    description: string;
    responsibleIds: string[];
  }) => {
    // In a real app, this would be an API call
    console.log('Creating new environment:', environmentData);
    setIsNewModalOpen(false);
  };

  const handleEditEnvironment = (environment: Environment) => {
    setEditingEnvironment(environment);
    setIsNewModalOpen(true);
  };

  const getEnvironmentEmployees = (environmentId: string) => {
    const employeeIds = mockEnvironmentEmployees
      .filter(ee => ee.environmentId === environmentId)
      .map(ee => ee.employeeId);
    
    return mockEmployees.filter(emp => employeeIds.includes(emp.id));
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="page-title mb-4 sm:mb-0">Ambientes</h1>
        
        {user?.role === 'manager' && (
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingEnvironment(null);
              setIsNewModalOpen(true);
            }}
          >
            Novo Ambiente
          </Button>
        )}
      </div>
      
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Buscar ambientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="type" className="form-label">Tipo</label>
            <select
              id="type"
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as EnvironmentType | 'all')}
            >
              <option value="all">Todos os tipos</option>
              {Object.entries(environmentTypes).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="block" className="form-label">Bloco</label>
            <select
              id="block"
              className="form-select"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              <option value="all">Todos os blocos</option>
              {blocks.map(block => (
                <option key={block} value={block}>Bloco {block}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEnvironments.map((environment) => {
          const employees = getEnvironmentEmployees(environment.id);

          return (
            <Card 
              key={environment.id} 
              className="flex flex-col hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{environment.name}</h3>
                  <p className="text-sm text-gray-500">Bloco {environment.block}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  environment.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {environment.isActive ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {environment.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {environmentTypes[environment.type]}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {environment.description}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Responsáveis:</h4>
                <div className="space-y-1">
                  {employees.map(employee => (
                    <div key={employee.id} className="text-sm">
                      <div className="font-medium">{employee.fullName}</div>
                      <div className="text-gray-500">{employee.email}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {user?.role === 'manager' && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit className="h-4 w-4" />}
                    onClick={() => handleEditEnvironment(environment)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Excluir
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      {filteredEnvironments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum ambiente encontrado</p>
        </div>
      )}

      <NewEnvironmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateEnvironment}
      />
    </div>
  );
};

export default Environments;