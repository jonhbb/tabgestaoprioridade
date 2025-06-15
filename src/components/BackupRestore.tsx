import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const BackupRestore = () => {
  const { toast } = useToast();

  const handleBackup = () => {
    try {
      // Coletar todos os dados do localStorage
      const backupData = {
        employees: localStorage.getItem('priority-system-employees'),
        priorities: localStorage.getItem('priority-system-priorities'),
        assignments: localStorage.getItem('priority-system-assignments'),
        timestamp: new Date().toISOString()
      };

      // Criar arquivo de backup
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-prioridades-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup realizado com sucesso!",
        description: "Seus dados foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer backup",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);

        // Validar estrutura do backup
        if (!backupData.employees || !backupData.priorities || !backupData.assignments) {
          throw new Error('Arquivo de backup inválido');
        }

        // Restaurar dados
        localStorage.setItem('priority-system-employees', backupData.employees);
        localStorage.setItem('priority-system-priorities', backupData.priorities);
        localStorage.setItem('priority-system-assignments', backupData.assignments);

        // Disparar evento para atualizar a interface
        window.dispatchEvent(new Event('storage'));

        toast({
          title: "Restauração concluída!",
          description: "Seus dados foram restaurados com sucesso.",
        });

        // Recarregar a página para atualizar todos os componentes
        window.location.reload();
      } catch (error) {
        toast({
          title: "Erro ao restaurar backup",
          description: "O arquivo selecionado não é um backup válido.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Backup e Restauração</CardTitle>
        <CardDescription>
          Faça backup dos seus dados ou restaure um backup anterior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Fazer Backup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Exporte todos os seus dados para um arquivo JSON
            </p>
            <Button onClick={handleBackup}>
              Exportar Backup
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Restaurar Backup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Importe um arquivo de backup para restaurar seus dados
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
                id="restore-file"
              />
              <Button
                onClick={() => document.getElementById('restore-file')?.click()}
                variant="outline"
              >
                Selecionar Arquivo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupRestore; 