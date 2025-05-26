import React, { useState } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import Button from '../common/Button';
import NewEmployeeModal from './NewEmployeeModal';
import { EnvironmentType } from '../../types';
import { mockEmployees } from '../../data/mockData';

interface NewEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (environment: {
    name: string;
    type: EnvironmentType;
    block: string;
    description: string;
    responsibleIds: string[];
  }) => void;
}

const environmentTypes: Record<EnvironmentType, string> = {
  classroom: 'Sala de Aula',
  laboratory: 'Laboratório',
  office: 'Escritório',
  workshop: 'Oficina',
  other: 'Outro',
};

const NewEnvironmentModal: React.FC<NewEnvironmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'classroom' as EnvironmentType,
    block: '',
    description: '',
    responsibleIds: [] as string[],
  });

  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      type: 'classroom',
      block: '',
      description: '',
      responsibleIds: [],
    });
  };

  const handleNewEmployee = (employee: { fullName: string; email: string }) => {
    // In a real app, this would be an API call
    console.log('Creating new employee:', employee);
    setIsNewEmployeeModalOpen(false);
  };

  const toggleResponsible = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      responsibleIds: prev.responsibleIds.includes(employeeId)
        ? prev.responsibleIds.filter(id => id !== employeeId)
        : [...prev.responsibleIds, employeeId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novo Ambiente</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Nome do Ambiente
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="form-label">
                    Tipo
                  </label>
                  <select
                    id="type"
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EnvironmentType })}
                    required
                  >
                    {Object.entries(environmentTypes).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="block" className="form-label">
                    Bloco
                  </label>
                  <input
                    type="text"
                    id="block"
                    className="form-input"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="form-label">Responsáveis</label>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<UserPlus className="h-4 w-4" />}
                      onClick={() => setIsNewEmployeeModalOpen(true)}
                    >
                      Novo Funcionário
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                    {mockEmployees.map(employee => (
                      <div
                        key={employee.id}
                        className={`
                          flex items-center justify-between p-2 rounded-md cursor-pointer
                          ${formData.responsibleIds.includes(employee.id)
                            ? 'bg-primary-50 border border-primary-200'
                            : 'hover:bg-gray-50 border border-transparent'
                          }
                        `}
                        onClick={() => toggleResponsible(employee.id)}
                      >
                        <div>
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                        <div className={`
                          w-5 h-5 rounded-full border-2
                          ${formData.responsibleIds.includes(employee.id)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                          }
                          flex items-center justify-center
                        `}>
                          {formData.responsibleIds.includes(employee.id) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.responsibleIds.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Selecione pelo menos um responsável
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={formData.responsibleIds.length === 0}
                >
                  Criar Ambiente
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <NewEmployeeModal
        isOpen={isNewEmployeeModalOpen}
        onClose={() => setIsNewEmployeeModalOpen(false)}
        onSubmit={handleNewEmployee}
      />
    </div>
  );
};

export default NewEnvironmentModal;