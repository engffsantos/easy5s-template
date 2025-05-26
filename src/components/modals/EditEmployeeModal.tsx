import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import { Employee, UserRole } from '../../types';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: {
    id?: string;
    fullName: string;
    email: string;
    role: UserRole;
    password?: string;
    confirmPassword?: string;
  }) => void;
  employee?: Employee;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
}) => {
  const [formData, setFormData] = useState({
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    role: employee?.role || 'responsible' as UserRole,
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Only validate passwords for new employees
    if (!employee) {
      if (!formData.password) {
        newErrors.password = 'A senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirme a senha';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      id: employee?.id,
      ...formData,
    });

    setFormData({
      fullName: '',
      email: '',
      role: 'responsible',
      password: '',
      confirmPassword: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
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
                  <label htmlFor="fullName" className="form-label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="form-label">
                    Função
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    required
                  >
                    <option value="responsible">Responsável</option>
                    <option value="inspector">Inspetor</option>
                    <option value="manager">Gerente</option>
                    <option value="student">Aluno</option>
                  </select>
                </div>

                {!employee && (
                  <>
                    <div>
                      <label htmlFor="password" className="form-label">
                        Senha
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirmar Senha
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-input"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {employee ? 'Salvar Alterações' : 'Criar Funcionário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEmployeeModal;