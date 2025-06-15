
import React, { useState, useEffect } from 'react';
import { User, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const EmployeeView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [assignedPriorities, setAssignedPriorities] = useState<AssignedPriority[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    const savedEmployees = localStorage.getItem('priority-system-employees');
    const savedPriorities = localStorage.getItem('priority-system-priorities');
    const savedAssignments = localStorage.getItem('priority-system-assignments');

    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedPriorities) setPriorities(JSON.parse(savedPriorities));
    if (savedAssignments) setAssignedPriorities(JSON.parse(savedAssignments));
  }, []);

  const getEmployeeById = (id: string) => employees.find(e => e.id === id);
  const getPriorityById = (id: string) => priorities.find(p => p.id === id);

  const getEmployeePriorities = (employeeId: string) => {
    const assignment = assignedPriorities.find(a => a.employeeId === employeeId);
    if (!assignment) return [];

    return assignment.priorities
      .sort((a, b) => a.order - b.order)
      .map(ap => getPriorityById(ap.priorityId))
      .filter(p => p !== undefined);
  };

  const selectedEmployeeData = selectedEmployee ? getEmployeeById(selectedEmployee) : null;
  const employeePriorities = selectedEmployee ? getEmployeePriorities(selectedEmployee) : [];

  const getOrderLabel = (index: number) => {
    switch (index) {
      case 0: return '1ª Prioridade';
      case 1: return '2ª Prioridade';
      case 2: return '3ª Prioridade';
      default: return `${index + 1}ª Prioridade`;
    }
  };

  if (employees.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum colaborador cadastrado</h3>
          <p className="text-muted-foreground">
            Não há colaboradores para visualizar as prioridades.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Visualização Individual</h1>
        <p className="text-muted-foreground">Visualize as prioridades atribuídas a cada colaborador</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Selecionar Colaborador</span>
          </CardTitle>
          <CardDescription>Escolha o colaborador para ver suas prioridades</CardDescription>
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

      {selectedEmployeeData && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedEmployeeData.fullName}</CardTitle>
                <CardDescription className="text-lg">{selectedEmployeeData.position}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {employeePriorities.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma prioridade atribuída</h3>
                <p className="text-muted-foreground">
                  Este colaborador ainda não possui prioridades definidas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Suas Prioridades:</h3>
                {employeePriorities.map((priority, index) => (
                  <div key={priority.id} className="relative">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="text-2xl font-bold text-gray-600">
                              #{index + 1}
                            </div>
                            <div className={`w-6 h-6 ${priority.color} rounded-full`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-xl font-semibold">{priority.name}</h4>
                              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                                {getOrderLabel(index)}
                              </span>
                            </div>
                            {priority.description && (
                              <p className="text-muted-foreground">{priority.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedEmployee && (
        <Card className="text-center py-12">
          <CardContent>
            <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Selecione um colaborador</h3>
            <p className="text-muted-foreground">
              Escolha um colaborador acima para visualizar suas prioridades.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">💡 Dica para colaboradores:</h3>
        <p className="text-sm text-green-700">
          Esta é a sua visão individual das prioridades. Concentre-se em executar as tarefas na ordem definida, 
          começando sempre pela 1ª prioridade e seguindo a sequência estabelecida pela gestão.
        </p>
      </div>
    </div>
  );
};

export default EmployeeView;
