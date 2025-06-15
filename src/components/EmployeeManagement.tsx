import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  fullName: string;
  position: string;
  createdAt: Date;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedEmployees = localStorage.getItem('priority-system-employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('priority-system-employees', JSON.stringify(newEmployees));
    window.dispatchEvent(new Event('employeesUpdated'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !position.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (editingEmployee) {
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, fullName: fullName.trim(), position: position.trim() }
          : emp
      );
      saveEmployees(updatedEmployees);
      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso!",
      });
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        fullName: fullName.trim(),
        position: position.trim(),
        createdAt: new Date(),
      };
      saveEmployees([...employees, newEmployee]);
      toast({
        title: "Sucesso",
        description: "Colaborador cadastrado com sucesso!",
      });
    }

    setFullName('');
    setPosition('');
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFullName(employee.fullName);
    setPosition(employee.position);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    saveEmployees(updatedEmployees);
    toast({
      title: "Sucesso",
      description: "Colaborador removido com sucesso!",
    });
  };

  const resetForm = () => {
    setFullName('');
    setPosition('');
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Colaboradores</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os membros da sua equipe</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Novo Colaborador</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Editar Colaborador' : 'Novo Colaborador'}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee ? 'Atualize as informações do colaborador.' : 'Cadastre um novo membro da equipe.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="position">Função</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Escrevente"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingEmployee ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employee.fullName}</CardTitle>
                    <CardDescription>{employee.position}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum colaborador cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando os membros da sua equipe para poder gerenciar suas prioridades.
            </p>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Colaborador
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Total de colaboradores: {employees.length}</h3>
        <p className="text-sm text-blue-700">
          Você pode cadastrar colaboradores no sistema. Cada colaborador pode ter suas prioridades organizadas individualmente.
        </p>
      </div>
    </div>
  );
};

export default EmployeeManagement;
