import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { mockEnvironments, mockUsers } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface NewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    environmentId: string;
    inspectorId: string;
    scheduledDate: string;
  }) => void;
}

const NewEvaluationModal: React.FC<NewEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    environmentId: '',
    inspectorId: user?.role === 'inspector' ? user.id : '',
    scheduledDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      environmentId: '',
      inspectorId: user?.role === 'inspector' ? user.id : '',
      scheduledDate: '',
    });
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Agendar Nova Vistoria</h3>
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
                  <label htmlFor="environment" className="form-label">
                    Ambiente
                  </label>
                  <select
                    id="environment"
                    className="form-select"
                    value={formData.environmentId}
                    onChange={(e) => setFormData({ ...formData, environmentId: e.target.value })}
                    required
                  >
                    <option value="">Selecione um ambiente...</option>
                    {mockEnvironments
                      .filter(env => env.isActive)
                      .map(env => (
                        <option key={env.id} value={env.id}>
                          {env.name} (Bloco {env.block})
                        </option>
                      ))
                    }
                  </select>
                </div>

                {user?.role === 'manager' && (
                  <div>
                    <label htmlFor="inspector" className="form-label">
                      Inspetor
                    </label>
                    <select
                      id="inspector"
                      className="form-select"
                      value={formData.inspectorId}
                      onChange={(e) => setFormData({ ...formData, inspectorId: e.target.value })}
                      required
                    >
                      <option value="">Selecione um inspetor...</option>
                      {mockUsers
                        .filter(u => u.role === 'inspector')
                        .map(inspector => (
                          <option key={inspector.id} value={inspector.id}>
                            {inspector.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="date" className="form-label">
                    Data da Vistoria
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="form-input"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={today}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  leftIcon={<Calendar className="h-4 w-4" />}
                >
                  Agendar Vistoria
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvaluationModal;