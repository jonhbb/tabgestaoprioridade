
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const AssignPriorities = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [assignedPriorities, setAssignedPriorities] = useState<AssignedPriority[]>([]);
  const [currentEmployeePriorities, setCurrentEmployeePriorities] = useState<Array<{
    priorityId: string;
    order: number;
  }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedEmployees = localStorage.getItem('priority-system-employees');
    const savedPriorities = localStorage.getItem('priority-system-priorities');
    const savedAssignments = localStorage.getItem('priority-system-assignments');

    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedPriorities) setPriorities(JSON.parse(savedPriorities));
    if (savedAssignments) setAssignedPriorities(JSON.parse(savedAssignments));
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const existingAssignment = assignedPriorities.find(a => a.employeeId === selectedEmployee);
      setCurrentEmployeePriorities(existingAssignment?.priorities || []);
    }
  }, [selectedEmployee, assignedPriorities]);

  const saveAssignments = (newAssignments: AssignedPriority[]) => {
    setAssignedPriorities(newAssignments);
    localStorage.setItem('priority-system-assignments', JSON.stringify(newAssignments));
  };

  const addPriorityToEmployee = (priorityId: string) => {
    if (currentEmployeePriorities.some(p => p.priorityId === priorityId)) {
      toast({
        title: "Aviso",
        description: "Esta prioridade já foi atribuída ao colaborador.",
        variant: "destructive",
      });
      return;
    }

    const newPriority = {
      priorityId,
      order: currentEmployeePriorities.length + 1,
    };

    setCurrentEmployeePriorities([...currentEmployeePriorities, newPriority]);
  };

  const removePriorityFromEmployee = (priorityId: string) => {
    const updatedPriorities = currentEmployeePriorities
      .filter(p => p.priorityId !== priorityId)
      .map((p, index) => ({ ...p, order: index + 1 }));
    
    setCurrentEmployeePriorities(updatedPriorities);
  };

  const movePriorityUp = (priorityId: string) => {
    const currentIndex = currentEmployeePriorities.findIndex(p => p.priorityId === priorityId);
    if (currentIndex > 0) {
      const newOrder = [...currentEmployeePriorities];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
      
      const reorderedPriorities = newOrder.map((p, index) => ({ ...p, order: index + 1 }));
      setCurrentEmployeePriorities(reorderedPriorities);
    }
  };

  const movePriorityDown = (priorityId: string) => {
    const currentIndex = currentEmployeePriorities.findIndex(p => p.priorityId === priorityId);
    if (currentIndex < currentEmployeePriorities.length - 1) {
      const newOrder = [...currentEmployeePriorities];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      
      const reorderedPriorities = newOrder.map((p, index) => ({ ...p, order: index + 1 }));
      setCurrentEmployeePriorities(reorderedPriorities);
    }
  };

  const saveEmployeePriorities = () => {
    if (!selectedEmployee) return;

    const updatedAssignments = assignedPriorities.filter(a => a.employeeId !== selectedEmployee);
    
    if (currentEmployeePriorities.length > 0) {
      updatedAssignments.push({
        employeeId: selectedEmployee,
        priorities: currentEmployeePriorities,
      });
    }

    saveAssignments(updatedAssignments);
    
    toast({
      title: "Sucesso",
      description: "Prioridades salvas com sucesso!",
    });
  };

  const getPriorityById = (id: string) => priorities.find(p => p.id === id);
  const getEmployeeById = (id: string) => employees.find(e => e.id === id);

  const availablePriorities = priorities.filter(
    p => !currentEmployeePriorities.some(cp => cp.priorityId === p.id)
  );

  if (employees.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum colaborador cadastrado</h3>
          <p className="text-muted-foreground">
            Você precisa cadastrar colaboradores antes de atribuir prioridades.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (priorities.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma prioridade cadastrada</h3>
          <p className="text-muted-foreground">
            Você precisa cadastrar prioridades antes de atribuí-las aos colaboradores.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Atribuir Prioridades</h1>
        <p className="text-muted-foreground">Defina e organize as prioridades para cada colaborador</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Colaborador</CardTitle>
          <CardDescription>Escolha o colaborador para atribuir ou editar suas prioridades</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um colaborador" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.fullName} - {employee.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prioridades Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Prioridades Disponíveis</CardTitle>
              <CardDescription>Clique para adicionar uma prioridade ao colaborador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {availablePriorities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Todas as prioridades foram atribuídas a este colaborador
                </p>
              ) : (
                availablePriorities.map((priority) => (
                  <div
                    key={priority.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => addPriorityToEmployee(priority.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${priority.color} rounded-full`} />
                      <div>
                        <p className="font-medium">{priority.name}</p>
                        {priority.description && (
                          <p className="text-sm text-muted-foreground">{priority.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Prioridades do Colaborador */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Prioridades de {getEmployeeById(selectedEmployee)?.fullName}</CardTitle>
                  <CardDescription>Organize a ordem de prioridade das atividades</CardDescription>
                </div>
                {currentEmployeePriorities.length > 0 && (
                  <Button onClick={saveEmployeePriorities}>
                    Salvar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentEmployeePriorities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma prioridade atribuída ainda
                </p>
              ) : (
                currentEmployeePriorities
                  .sort((a, b) => a.order - b.order)
                  .map((assignedPriority, index) => {
                    const priority = getPriorityById(assignedPriority.priorityId);
                    if (!priority) return null;

                    return (
                      <div key={priority.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            <div className={`w-4 h-4 ${priority.color} rounded-full`} />
                          </div>
                          <div>
                            <p className="font-medium">{priority.name}</p>
                            {priority.description && (
                              <p className="text-sm text-muted-foreground">{priority.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => movePriorityUp(priority.id)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => movePriorityDown(priority.id)}
                            disabled={index === currentEmployeePriorities.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePriorityFromEmployee(priority.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 mb-2">Como usar:</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>1. Selecione o colaborador que deseja configurar</p>
          <p>2. Clique nas prioridades disponíveis para adicioná-las</p>
          <p>3. Use as setas para reordenar as prioridades</p>
          <p>4. Clique em "Salvar" para confirmar as alterações</p>
        </div>
      </div>
    </div>
  );
};

export default AssignPriorities;
