
import React, { useState, useEffect } from 'react';
import { Users, Target, Settings, BarChart3, User, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  fullName: string;
  position: string;
}

interface Priority {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface AssignedPriority {
  employeeId: string;
  priorities: Array<{
    priorityId: string;
    order: number;
  }>;
}

const AdminDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [assignedPriorities, setAssignedPriorities] = useState<AssignedPriority[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedEmployees = localStorage.getItem('priority-system-employees');
    const savedPriorities = localStorage.getItem('priority-system-priorities');
    const savedAssignments = localStorage.getItem('priority-system-assignments');

    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedPriorities) setPriorities(JSON.parse(savedPriorities));
    if (savedAssignments) setAssignedPriorities(JSON.parse(savedAssignments));
  }, []);

  const saveAssignments = (newAssignments: AssignedPriority[]) => {
    setAssignedPriorities(newAssignments);
    localStorage.setItem('priority-system-assignments', JSON.stringify(newAssignments));
  };

  const getEmployeeById = (id: string) => employees.find(e => e.id === id);
  const getPriorityById = (id: string) => priorities.find(p => p.id === id);

  const getEmployeePriorities = (employeeId: string) => {
    const assignment = assignedPriorities.find(a => a.employeeId === employeeId);
    if (!assignment) return [];

    return assignment.priorities
      .sort((a, b) => a.order - b.order)
      .map(ap => ({
        ...ap,
        priority: getPriorityById(ap.priorityId)
      }))
      .filter(p => p.priority !== undefined);
  };

  const movePriorityUp = (employeeId: string, priorityId: string) => {
    const assignment = assignedPriorities.find(a => a.employeeId === employeeId);
    if (!assignment) return;

    const currentIndex = assignment.priorities.findIndex(p => p.priorityId === priorityId);
    if (currentIndex > 0) {
      const newPriorities = [...assignment.priorities];
      [newPriorities[currentIndex - 1], newPriorities[currentIndex]] = 
      [newPriorities[currentIndex], newPriorities[currentIndex - 1]];
      
      const reorderedPriorities = newPriorities.map((p, index) => ({ ...p, order: index + 1 }));
      
      const updatedAssignments = assignedPriorities.map(a => 
        a.employeeId === employeeId 
          ? { ...a, priorities: reorderedPriorities }
          : a
      );
      
      saveAssignments(updatedAssignments);
      toast({
        title: "Sucesso",
        description: "Prioridade reordenada com sucesso!",
      });
    }
  };

  const movePriorityDown = (employeeId: string, priorityId: string) => {
    const assignment = assignedPriorities.find(a => a.employeeId === employeeId);
    if (!assignment) return;

    const currentIndex = assignment.priorities.findIndex(p => p.priorityId === priorityId);
    if (currentIndex < assignment.priorities.length - 1) {
      const newPriorities = [...assignment.priorities];
      [newPriorities[currentIndex], newPriorities[currentIndex + 1]] = 
      [newPriorities[currentIndex + 1], newPriorities[currentIndex]];
      
      const reorderedPriorities = newPriorities.map((p, index) => ({ ...p, order: index + 1 }));
      
      const updatedAssignments = assignedPriorities.map(a => 
        a.employeeId === employeeId 
          ? { ...a, priorities: reorderedPriorities }
          : a
      );
      
      saveAssignments(updatedAssignments);
      toast({
        title: "Sucesso",
        description: "Prioridade reordenada com sucesso!",
      });
    }
  };

  const removePriorityFromEmployee = (employeeId: string, priorityId: string) => {
    const assignment = assignedPriorities.find(a => a.employeeId === employeeId);
    if (!assignment) return;

    const updatedPriorities = assignment.priorities
      .filter(p => p.priorityId !== priorityId)
      .map((p, index) => ({ ...p, order: index + 1 }));

    const updatedAssignments = assignedPriorities.map(a => 
      a.employeeId === employeeId 
        ? { ...a, priorities: updatedPriorities }
        : a
    );

    saveAssignments(updatedAssignments);
    toast({
      title: "Sucesso",
      description: "Prioridade removida com sucesso!",
    });
  };

  const getStats = () => {
    const totalEmployees = employees.length;
    const totalPriorities = priorities.length;
    const employeesWithPriorities = assignedPriorities.length;
    const employeesWithoutPriorities = totalEmployees - employeesWithPriorities;

    return {
      totalEmployees,
      totalPriorities,
      employeesWithPriorities,
      employeesWithoutPriorities,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral e gerenciamento de todas as prioridades</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Prioridades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPriorities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Prioridades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.employeesWithPriorities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Prioridades</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.employeesWithoutPriorities}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Colaboradores e suas Prioridades */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Prioridades por Colaborador</h2>
        
        {employees.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum colaborador cadastrado</h3>
              <p className="text-muted-foreground">
                Cadastre colaboradores para começar a gerenciar prioridades.
              </p>
            </CardContent>
          </Card>
        ) : (
          employees.map((employee) => {
            const employeePriorities = getEmployeePriorities(employee.id);
            const isEditing = editingEmployee === employee.id;

            return (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{employee.fullName}</CardTitle>
                        <CardDescription>{employee.position}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditingEmployee(isEditing ? null : employee.id)}
                    >
                      {isEditing ? "Concluir Edição" : "Editar"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {employeePriorities.length === 0 ? (
                    <p className="text-muted-foreground italic">Nenhuma prioridade atribuída</p>
                  ) : (
                    <div className="space-y-2">
                      {employeePriorities.map((ep, index) => (
                        <div
                          key={ep.priorityId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-bold text-gray-600">#{index + 1}</div>
                            <div className={`w-4 h-4 ${ep.priority.color} rounded-full`} />
                            <div>
                              <p className="font-medium">{ep.priority.name}</p>
                              {ep.priority.description && (
                                <p className="text-sm text-muted-foreground">{ep.priority.description}</p>
                              )}
                            </div>
                          </div>
                          
                          {isEditing && (
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => movePriorityUp(employee.id, ep.priorityId)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => movePriorityDown(employee.id, ep.priorityId)}
                                disabled={index === employeePriorities.length - 1}
                              >
                                <ArrowDown className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removePriorityFromEmployee(employee.id, ep.priorityId)}
                                className="text-red-600 hover:text-red-700"
                              >
                                ×
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">🔧 Funcionalidades do Painel Admin:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Visualize todas as prioridades de todos os colaboradores</p>
          <p>• Clique em "Editar" para reordenar ou remover prioridades</p>
          <p>• Use as setas para mover prioridades para cima ou para baixo</p>
          <p>• Clique no "×" para remover uma prioridade de um colaborador</p>
          <p>• Acompanhe as estatísticas gerais do sistema</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
