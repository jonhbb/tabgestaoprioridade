import React, { useState } from 'react';
import { Users, Target, Settings, Eye, Calendar, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmployeeManagement from '@/components/EmployeeManagement';
import PriorityManagement from '@/components/PriorityManagement';
import AssignPriorities from '@/components/AssignPriorities';
import EmployeeView from '@/components/EmployeeView';
import AdminDashboard from '@/components/AdminDashboard';
import Reports from '@/components/Reports';
import BackupRestore from '@/components/BackupRestore';

type Section = 'dashboard' | 'employees' | 'priorities' | 'assign' | 'view' | 'admin' | 'reports' | 'backup';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');

  const menuItems = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: Calendar, description: 'Visão geral do sistema' },
    { id: 'employees' as Section, label: 'Colaboradores', icon: Users, description: 'Gerenciar colaboradores' },
    { id: 'priorities' as Section, label: 'Prioridades', icon: Target, description: 'Gerenciar tipos de prioridades' },
    { id: 'assign' as Section, label: 'Atribuir', icon: Settings, description: 'Definir prioridades por colaborador' },
    { id: 'view' as Section, label: 'Visualizar', icon: Eye, description: 'Ver prioridades individuais' },
    { id: 'reports' as Section, label: 'Relatórios', icon: FileText, description: 'Gerar relatórios do sistema' },
    { id: 'backup' as Section, label: 'Backup', icon: Database, description: 'Backup e restauração de dados' },
    { id: 'admin' as Section, label: 'Painel Admin', icon: Settings, description: 'Gerenciamento geral' },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'employees':
        return <EmployeeManagement />;
      case 'priorities':
        return <PriorityManagement />;
      case 'assign':
        return <AssignPriorities />;
      case 'view':
        return <EmployeeView />;
      case 'admin':
        return <AdminDashboard />;
      case 'reports':
        return <Reports />;
      case 'backup':
        return <BackupRestore />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema de Gestão de Prioridades
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Organize e gerencie as prioridades da sua equipe de forma eficiente e intuitiva
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.slice(1).map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-blue-200"
                  onClick={() => setCurrentSection(item.id)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Como usar o sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-blue-600 mb-2">1. Colaboradores</div>
                  <p>Cadastre os membros da equipe com nome e função</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-purple-600 mb-2">2. Prioridades</div>
                  <p>Defina os tipos de atividades e tarefas</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-green-600 mb-2">3. Atribuir</div>
                  <p>Organize as prioridades por colaborador</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-orange-600 mb-2">4. Visualizar</div>
                  <p>Colaboradores veem suas prioridades</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setCurrentSection('dashboard')}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Gerenciamento de Prioridades</span>
              </div>
              
              <div className="hidden md:flex space-x-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentSection === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentSection(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden bg-white border-b">
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentSection === item.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentSection(item.id)}
                className="flex items-center space-x-1 text-xs"
              >
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;
