import React, { useState, useEffect } from 'react';
import { Download, Filter, Users, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

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
  priorities: {
    priorityId: string;
    order: number;
  }[];
}

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  blueLine: {
    height: 2,
    backgroundColor: '#2563eb', // azul-600 do Tailwind
    marginBottom: 20,
    width: '100%',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  employeeName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  employeePosition: {
    fontSize: 14,
    marginBottom: 10,
  },
  priorityList: {
    marginLeft: 20,
  },
  priorityItem: {
    fontSize: 12,
    marginBottom: 5,
  },
  priorityDescription: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 5,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTop: '1pt solid #ccc',
    paddingTop: 10,
  },
  separator: {
    borderBottom: '1pt solid #ccc',
    marginVertical: 10,
  },
});

const Reports = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [assignedPriorities, setAssignedPriorities] = useState<AssignedPriority[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [showPdf, setShowPdf] = useState(false);
  const { toast } = useToast();

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
      .map(ap => ({
        ...ap,
        priority: getPriorityById(ap.priorityId)
      }))
      .filter(p => p.priority !== undefined);
  };

  const generatePdf = () => {
    setShowPdf(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const PDFDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Gerenciamento de Prioridade</Text>
          <Text style={styles.subtitle}>Tabelionato e Registro Civil de Tramandaí</Text>
          <View style={styles.blueLine} />
        </View>

        {selectedEmployee === 'all' ? (
          // Relatório geral
          employees.map((employee) => {
            const employeePriorities = getEmployeePriorities(employee.id);
            return (
              <View key={employee.id} style={styles.section}>
                <Text style={styles.employeeName}>Nome: {employee.fullName}</Text>
                <Text style={styles.employeePosition}>Função: {employee.position}</Text>
                <View style={styles.priorityList}>
                  {employeePriorities.map((ep, index) => (
                    <View key={ep.priorityId}>
                      <Text style={styles.priorityItem}>
                        {index + 1}. {ep.priority?.name}
                      </Text>
                      {ep.priority?.description && (
                        <Text style={styles.priorityDescription}>
                          {ep.priority.description}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
                <View style={styles.separator} />
              </View>
            );
          })
        ) : (
          // Relatório individual
          (() => {
            const employee = getEmployeeById(selectedEmployee);
            if (!employee) return null;
            const employeePriorities = getEmployeePriorities(selectedEmployee);
            return (
              <View style={styles.section}>
                <Text style={styles.employeeName}>Nome: {employee.fullName}</Text>
                <Text style={styles.employeePosition}>Função: {employee.position}</Text>
                <View style={styles.priorityList}>
                  {employeePriorities.map((ep, index) => (
                    <View key={ep.priorityId}>
                      <Text style={styles.priorityItem}>
                        {index + 1}. {ep.priority?.name}
                      </Text>
                      {ep.priority?.description && (
                        <Text style={styles.priorityDescription}>
                          {ep.priority.description}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            );
          })()
        )}

        <Text style={styles.footer}>
          Concentre-se em executar as tarefas na ordem definida, começando sempre pela 1ª prioridade e seguindo a sequência estabelecida pela gestão
        </Text>
      </Page>
    </Document>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Gere relatórios detalhados das prioridades dos colaboradores
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>
            Selecione um colaborador ou gere um relatório geral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Todos os Colaboradores</span>
                    </div>
                  </SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generatePdf} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Gerar Relatório</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPdf && (
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Relatório</CardTitle>
            <CardDescription>
              Visualize o relatório antes de imprimir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[800px] w-full">
              <PDFViewer width="100%" height="100%">
                <PDFDocument />
              </PDFViewer>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handlePrint} className="flex items-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Informações sobre os relatórios:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• O relatório será gerado em formato PDF</p>
          <p>• Para relatório geral, selecione "Todos os Colaboradores"</p>
          <p>• Para relatório individual, selecione um colaborador específico</p>
          <p>• Você pode visualizar o relatório antes de imprimir</p>
        </div>
      </div>
    </div>
  );
};

export default Reports; 