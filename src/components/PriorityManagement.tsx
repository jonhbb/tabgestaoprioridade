import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Priority {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
}

const PRIORITY_COLORS = [
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Laranja', value: 'bg-orange-500' },
  { name: 'Roxo', value: 'bg-purple-500' },
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Vermelho', value: 'bg-red-500' },
  { name: 'Amarelo', value: 'bg-yellow-500' },
  { name: 'Ciano', value: 'bg-cyan-500' },
  { name: 'Índigo', value: 'bg-indigo-500' },
  { name: 'Violeta', value: 'bg-violet-500' },
  { name: 'Azul Claro', value: 'bg-sky-500' },
  { name: 'Verde Claro', value: 'bg-emerald-500' },
  { name: 'Laranja Claro', value: 'bg-amber-500' },
  { name: 'Rosa Claro', value: 'bg-rose-500' },
  { name: 'Azul Escuro', value: 'bg-blue-700' },
  { name: 'Verde Escuro', value: 'bg-green-700' },
];

const PriorityManagement = () => {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const { toast } = useToast();

  useEffect(() => {
    const savedPriorities = localStorage.getItem('priority-system-priorities');
    if (savedPriorities) {
      setPriorities(JSON.parse(savedPriorities));
    }
  }, []);

  const savePriorities = (newPriorities: Priority[]) => {
    setPriorities(newPriorities);
    localStorage.setItem('priority-system-priorities', JSON.stringify(newPriorities));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da prioridade.",
        variant: "destructive",
      });
      return;
    }

    if (editingPriority) {
      const updatedPriorities = priorities.map(priority => 
        priority.id === editingPriority.id 
          ? { ...priority, name: name.trim(), description: description.trim(), color: selectedColor }
          : priority
      );
      savePriorities(updatedPriorities);
      toast({
        title: "Sucesso",
        description: "Prioridade atualizada com sucesso!",
      });
    } else {
      const newPriority: Priority = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
        createdAt: new Date(),
      };
      savePriorities([...priorities, newPriority]);
      toast({
        title: "Sucesso",
        description: "Prioridade cadastrada com sucesso!",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (priority: Priority) => {
    setEditingPriority(priority);
    setName(priority.name);
    setDescription(priority.description);
    setSelectedColor(priority.color);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedPriorities = priorities.filter(priority => priority.id !== id);
    savePriorities(updatedPriorities);
    toast({
      title: "Sucesso",
      description: "Prioridade removida com sucesso!",
    });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedColor('bg-blue-500');
    setEditingPriority(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Prioridades</h1>
          <p className="text-muted-foreground">Defina os tipos de atividades e tarefas da sua equipe</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nova Prioridade</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPriority ? 'Editar Prioridade' : 'Nova Prioridade'}
              </DialogTitle>
              <DialogDescription>
                {editingPriority ? 'Atualize as informações da prioridade.' : 'Cadastre um novo tipo de atividade ou tarefa.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Prioridade</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Atendimento ao Cliente"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva brevemente esta prioridade..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Cor da Prioridade</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRIORITY_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.value} border-2 ${
                        selectedColor === color.value ? 'border-gray-800' : 'border-gray-300'
                      } hover:scale-110 transition-transform`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPriority ? 'Atualizar' : 'Cadastrar'}
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
        {priorities.map((priority) => (
          <Card key={priority.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${priority.color} rounded-full flex items-center justify-center`}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{priority.name}</CardTitle>
                    {priority.description && (
                      <CardDescription className="mt-1">
                        {priority.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(priority)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(priority.id)}
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

      {priorities.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma prioridade cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece definindo os tipos de atividades e tarefas que sua equipe executa.
            </p>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeira Prioridade
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">Exemplos de prioridades:</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Atendimento Balcão </p>
          <p>• Atendimento em Salas</p>
          <p>• Elaboração de Minutas</p>
        </div>
      </div>
    </div>
  );
};

export default PriorityManagement;
