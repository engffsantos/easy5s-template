import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, UserCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EditEmployeeModal from '../components/modals/EditEmployeeModal';
import { mockEmployees, mockEnvironments, mockEnvironmentEmployees } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Employee } from '../types';

const Employees: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  
  // Filter employees based on search and environment filter
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = 
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesEnvironment = selectedEnvironment === 'all' || 
      mockEnvironmentEmployees.some(ee => 
        ee.employeeId === employee.id && ee.environmentId === selectedEnvironment
      );
    
    return matchesSearch && matchesEnvironment;
  });

  const handleEditEmployee = (employee?: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleSubmitEmployee = (employeeData: {
    id?: string;
    fullName: string;
    email: string;
    role: string;
  }) => {
    // In a real app, this would be an API call
    console.log('Saving employee:', employeeData);
    setIsEditModalOpen(false);
    setEditingEmployee(undefined);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    // In a real app, this would be an API call
    console.log('Deleting employee:', employeeId);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      manager: 'Gerente',
      inspector: 'Inspetor',
      student: 'Aluno',
      responsible: 'Responsável',
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      manager: 'bg-primary-100 text-primary-800',
      inspector: 'bg-secondary-100 text-secondary-800',
      student: 'bg-accent-100 text-accent-800',
      responsible: 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="page-title mb-2">Funcionários</h1>
          <p className="text-gray-600">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'funcionário encontrado' : 'funcionários encontrados'}
          </p>
        </div>
        
        {user?.role === 'manager' && (
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => handleEditEmployee()}
          >
            Novo Funcionário
          </Button>
        )}
      </div>
      
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Buscar funcionários..."
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
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const employeeEnvironments = mockEnvironmentEmployees
            .filter(ee => ee.employeeId === employee.id)
            .map(ee => mockEnvironments.find(env => env.id === ee.environmentId))
            .filter(Boolean);

          return (
            <Card 
              key={employee.id} 
              className="hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.fullName}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {employee.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(employee.role)}`}>
                  {getRoleLabel(employee.role)}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ambientes Responsável:</h4>
                <div className="flex flex-wrap gap-2">
                  {employeeEnvironments.map(env => env && (
                    <span 
                      key={env.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {env.name}
                    </span>
                  ))}
                  {employeeEnvironments.length === 0 && (
                    <span className="text-sm text-gray-500">
                      Nenhum ambiente associado
                    </span>
                  )}
                </div>
              </div>
              
              {user?.role === 'manager' && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit className="h-4 w-4" />}
                    onClick={() => handleEditEmployee(employee)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Excluir
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum funcionário encontrado</p>
        </div>
      )}

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(undefined);
        }}
        onSubmit={handleSubmitEmployee}
        employee={editingEmployee}
      />
    </div>
  );
};

export default Employees;