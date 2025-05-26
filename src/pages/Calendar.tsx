import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { format } from 'date-fns';
import { CalendarDays, Plus, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import NewEvaluationModal from '../components/modals/NewEvaluationModal';
import { mockScheduledEvaluations, mockEnvironments, mockUsers } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  
  // Transform scheduled evaluations to calendar events
  const calendarEvents = mockScheduledEvaluations.map(scheduled => {
    const environment = mockEnvironments.find(env => env.id === scheduled.environmentId);
    const inspector = mockUsers.find(u => u.id === scheduled.inspectorId);
    
    return {
      id: scheduled.id,
      title: `${environment?.name || 'Ambiente'}`,
      start: scheduled.scheduledDate,
      end: scheduled.scheduledDate,
      color: scheduled.status === 'completed' 
        ? '#22c55e' // Green for completed
        : scheduled.status === 'canceled' 
          ? '#ef4444' // Red for canceled
          : '#0056A4', // Blue for scheduled
      extendedProps: {
        environmentId: scheduled.environmentId,
        inspectorId: scheduled.inspectorId,
        status: scheduled.status,
        environmentName: environment?.name,
        inspectorName: inspector?.name,
      },
    };
  });
  
  // Get today's and upcoming evaluations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvaluations = mockScheduledEvaluations
    .filter(scheduled => {
      const scheduledDate = new Date(scheduled.scheduledDate);
      scheduledDate.setHours(0, 0, 0, 0);
      return scheduledDate >= today && scheduled.status !== 'completed';
    })
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const handleScheduleEvaluation = (data: {
    environmentId: string;
    inspectorId: string;
    scheduledDate: string;
  }) => {
    // In a real app, this would be an API call
    console.log('Scheduling evaluation:', data);
    setIsNewModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="page-title mb-2 sm:mb-0">Calendário de Vistorias</h1>
        
        {user?.role !== 'student' && (
          <div className="flex space-x-3">
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsNewModalOpen(true)}
            >
              Agendar Vistoria
            </Button>
            
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  currentView === 'calendar'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10`}
                onClick={() => setCurrentView('calendar')}
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  currentView === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10`}
                onClick={() => setCurrentView('list')}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-${currentView === 'calendar' ? '2' : '3'}`}>
          {currentView === 'calendar' ? (
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Calendário de Vistorias</h2>
              </div>
              <div className="p-4">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth',
                  }}
                  height="auto"
                  eventContent={(eventInfo) => {
                    return (
                      <div className="p-1 text-xs">
                        <div className="font-semibold truncate">
                          {eventInfo.event.title}
                        </div>
                        <div className="text-xs truncate">
                          {eventInfo.event.extendedProps.inspectorName}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Lista de Vistorias</h2>
              
              <div className="space-y-4">
                {mockScheduledEvaluations.map(scheduled => {
                  const environment = mockEnvironments.find(env => env.id === scheduled.environmentId);
                  const inspector = mockUsers.find(u => u.id === scheduled.inspectorId);
                  const scheduledDate = new Date(scheduled.scheduledDate);
                  
                  return (
                    <div 
                      key={scheduled.id}
                      className="flex items-center border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div 
                        className={`
                          w-12 h-12 rounded-lg flex items-center justify-center mr-3 
                          ${scheduled.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : scheduled.status === 'canceled' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-blue-100 text-blue-600'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-xs font-semibold">
                            {format(scheduledDate, 'MMM')}
                          </div>
                          <div className="text-lg font-bold">
                            {format(scheduledDate, 'dd')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{environment?.name}</div>
                        <div className="text-sm text-gray-500">
                          Inspetor: {inspector?.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(scheduledDate, 'dd/MM/yyyy')}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <span 
                          className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${scheduled.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : scheduled.status === 'canceled' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }
                          `}
                        >
                          {scheduled.status === 'completed' 
                            ? 'Concluída' 
                            : scheduled.status === 'canceled' 
                              ? 'Cancelada' 
                              : 'Agendada'
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
        
        {currentView === 'calendar' && (
          <div className="lg:col-span-1">
            <Card title="Próximas Vistorias">
              {upcomingEvaluations.length > 0 ? (
                <div className="divide-y">
                  {upcomingEvaluations.slice(0, 5).map(scheduled => {
                    const environment = mockEnvironments.find(env => env.id === scheduled.environmentId);
                    const inspector = mockUsers.find(u => u.id === scheduled.inspectorId);
                    
                    return (
                      <div key={scheduled.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="font-medium">{environment?.name}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(scheduled.scheduledDate), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Inspetor: {inspector?.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Não há vistorias agendadas
                </div>
              )}
            </Card>
            
            <Card title="Legenda" className="mt-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-primary-500 mr-2"></div>
                  <span className="text-sm">Agendada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-success-500 mr-2"></div>
                  <span className="text-sm">Concluída</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-error-500 mr-2"></div>
                  <span className="text-sm">Cancelada</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <NewEvaluationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleScheduleEvaluation}
      />
    </div>
  );
};

export default Calendar;