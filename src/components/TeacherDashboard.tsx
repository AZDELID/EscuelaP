import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LogOut, GraduationCap, BookOpen, Save, ArrowLeft, Download, AlertTriangle, Menu, Edit2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { SmartPagination } from './SmartPagination';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from './ui/pagination';
import {
  getTeacherCourses,
  getCourseStudents,
  getCourseGrades,
  updateStudentGrade,
  calculateUnitGrade,
  initializeGradesStorage,
  getCourseName,
  getGradeName,
  courses,
  type Student,
  type StudentGrade,
  type GradeComponent
} from '../utils/mockDatabase';

interface TeacherDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function TeacherDashboard({ user, accessToken, onLogout }: TeacherDashboardProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courseGrades, setCourseGrades] = useState<StudentGrade[]>([]);
  const [editingGrades, setEditingGrades] = useState<Map<string, StudentGrade>>(new Map());
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [sortByMerit, setSortByMerit] = useState<boolean>(false);
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // Modo edición de pantalla completa
  const [editingSection, setEditingSection] = useState<string | null>(null); // Sección que se está editando
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    initializeGradesStorage();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseGrades(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourseGrades = (courseId: string) => {
    const grades = getCourseGrades(courseId);
    setCourseGrades(grades);
    
    // Inicializar editingGrades con los datos actuales
    const editMap = new Map<string, StudentGrade>();
    grades.forEach(grade => {
      editMap.set(grade.id, { ...grade });
    });
    setEditingGrades(editMap);
  };

  const teacherCourses = getTeacherCourses(user.id);

  const handleGradeChange = (
    gradeId: string,
    unidad: 'unidad1' | 'unidad2' | 'unidad3' | 'unidad4',
    component: 'tareas' | 'conceptual' | 'examenes',
    value: string
  ) => {
    const currentGrade = editingGrades.get(gradeId);
    if (!currentGrade) return;

    const updatedGrade = { ...currentGrade };
    
    // Permitir borrar nota si el valor está vacío
    if (value === '' || value === null) {
      // Si todos los componentes están vacíos, marcar la unidad como null
      const currentUnit = updatedGrade[unidad];
      if (currentUnit) {
        const newUnit = { ...currentUnit, [component]: 0 };
        // Si todos son 0, poner la unidad en null
        if (newUnit.tareas === 0 && newUnit.conceptual === 0 && newUnit.examenes === 0) {
          updatedGrade[unidad] = null;
        } else {
          updatedGrade[unidad] = newUnit;
        }
      }
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 20) return;

      const currentUnit = updatedGrade[unidad] || { tareas: 0, conceptual: 0, examenes: 0 };
      
      updatedGrade[unidad] = {
        ...currentUnit,
        [component]: numValue
      };
    }

    const newEditMap = new Map(editingGrades);
    newEditMap.set(gradeId, updatedGrade);
    setEditingGrades(newEditMap);
  };

  const saveGrades = () => {
    editingGrades.forEach(grade => {
      updateStudentGrade(grade);
    });
    
    toast.success('Notas guardadas correctamente');
    if (selectedCourse) {
      loadCourseGrades(selectedCourse);
    }
  };

  const calculateFinalGrade = (components: GradeComponent): number => {
    return calculateUnitGrade(components);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 18) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 11) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const calculateStudentAverage = (gradeRecord: StudentGrade): number | null => {
    const units = [gradeRecord.unidad1, gradeRecord.unidad2, gradeRecord.unidad3, gradeRecord.unidad4];
    const validUnits = units.filter(u => u !== null) as GradeComponent[];
    
    // Solo mostrar promedio si están las 4 unidades
    if (validUnits.length !== 4) return null;
    
    const sum = validUnits.reduce((acc, unit) => acc + calculateUnitGrade(unit), 0);
    return Math.round((sum / validUnits.length) * 10) / 10;
  };

  // Función para exportar calificaciones a CSV
  const exportToCSV = () => {
    if (!selectedCourse) return;
    
    const courseStudents = getCourseStudents(selectedCourse);
    const courseName = getCourseName(selectedCourse);
    const gradeName = getGradeName(courses.find(c => c.id === selectedCourse)?.gradeId || '');
    
    let csv = 'Estudiante,Unidad 1,Tareas 1,Conceptual 1,Exámenes 1,Unidad 2,Tareas 2,Conceptual 2,Exámenes 2,Unidad 3,Tareas 3,Conceptual 3,Exámenes 3,Unidad 4,Tareas 4,Conceptual 4,Exámenes 4,Promedio Final\n';
    
    courseStudents.forEach(student => {
      const gradeRecord = courseGrades.find(g => g.studentId === student.id);
      if (!gradeRecord) return;
      
      const promedio = calculateStudentAverage(gradeRecord);
      
      let row = `"${student.fullName}",`;
      
      ['unidad1', 'unidad2', 'unidad3', 'unidad4'].forEach(unidad => {
        const unitData = gradeRecord[unidad as keyof typeof gradeRecord] as GradeComponent | null;
        if (unitData) {
          const finalGrade = calculateFinalGrade(unitData);
          row += `${finalGrade.toFixed(1)},${unitData.tareas},${unitData.conceptual},${unitData.examenes},`;
        } else {
          row += ',,,,'
        }
      });
      
      row += promedio !== null ? promedio.toFixed(1) : '';
      csv += row + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${courseName}_${gradeName}_Calificaciones.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Calificaciones exportadas correctamente');
  };

  // Función para obtener estudiantes en riesgo
  const getStudentsAtRisk = (): { student: Student; average: number }[] => {
    if (!selectedCourse) return [];
    
    const courseStudents = getCourseStudents(selectedCourse);
    const studentsAtRisk: { student: Student; average: number }[] = [];
    
    courseStudents.forEach(student => {
      const gradeRecord = courseGrades.find(g => g.studentId === student.id);
      if (!gradeRecord) return;
      
      const average = calculateStudentAverage(gradeRecord);
      if (average !== null && average < 11) {
        studentsAtRisk.push({ student, average });
      }
    });
    
    return studentsAtRisk.sort((a, b) => a.average - b.average);
  };

  // Función para ordenar estudiantes alfabéticamente por apellido
  const sortStudentsByLastName = (students: Student[]): Student[] => {
    return [...students].sort((a, b) => {
      // Los estudiantes ya tienen formato "Apellidos, Nombres"
      return a.fullName.localeCompare(b.fullName, 'es');
    });
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // Si hay un curso seleccionado, mostrar solo la pantalla de ese curso
  if (selectedCourse) {
    const courseInfo = courses.find(c => c.id === selectedCourse);
    const allStudents = getCourseStudents(selectedCourse);
    
    // Agrupar estudiantes por sección
    const studentsBySection = allStudents.reduce((acc, student) => {
      if (!acc[student.section]) {
        acc[student.section] = [];
      }
      acc[student.section].push(student);
      return acc;
    }, {} as Record<string, Student[]>);
    
    // Ordenar estudiantes dentro de cada sección
    Object.keys(studentsBySection).forEach(section => {
      studentsBySection[section] = sortStudentsByLastName(studentsBySection[section]);
    });
    
    // Ordenar las secciones alfabéticamente (A, B, etc.)
    const sections = Object.keys(studentsBySection).sort();

    // Si estamos en modo edición, mostrar la pantalla de edición
    if (isEditMode && editingSection) {
      const sectionStudents = studentsBySection[editingSection];

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
          {/* Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Portal del Docente</p>
                    <h1 className="text-2xl">{user.name}</h1>
                  </div>
                </div>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Modificar Notas - Sección {editingSection}</CardTitle>
                    <CardDescription>
                      {getCourseName(selectedCourse)} - {courseInfo ? getGradeName(courseInfo.gradeId) : ''}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setSortByMerit(!sortByMerit)}
                    >
                      {sortByMerit ? 'Ver por Orden Alfabético' : 'Ver Orden de Mérito'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditMode(false);
                        setEditingSection(null);
                        setSortByMerit(false);
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => {
                        saveGrades();
                        setIsEditMode(false);
                        setEditingSection(null);
                        setSortByMerit(false);
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead rowSpan={2} className="border text-center align-middle bg-gray-100">
                          Estudiante
                        </TableHead>
                        {[1, 2, 3, 4].map(unit => (
                          <TableHead key={`header-unit-${unit}`} colSpan={4} className="border text-center bg-purple-100">
                            Unidad {unit}
                          </TableHead>
                        ))}
                        <TableHead rowSpan={2} className="border text-center align-middle bg-green-100">
                          Promedio<br/>Final
                        </TableHead>
                      </TableRow>
                      <TableRow>
                        {[1, 2, 3, 4].map(unit => (
                          <React.Fragment key={`subheader-unit-${unit}`}>
                            <TableHead className="border text-center text-xs bg-purple-50">30%</TableHead>
                            <TableHead className="border text-center text-xs bg-purple-50">30%</TableHead>
                            <TableHead className="border text-center text-xs bg-purple-50">40%</TableHead>
                            <TableHead className="border text-center text-xs bg-purple-50">Prom.</TableHead>
                          </React.Fragment>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        // Ordenar estudiantes según la opción seleccionada
                        let displayStudents = [...sectionStudents];
                        
                        if (sortByMerit) {
                          // Ordenar por promedio final (mayor a menor)
                          displayStudents = displayStudents.sort((a, b) => {
                            const gradeA = courseGrades.find(g => g.studentId === a.id);
                            const gradeB = courseGrades.find(g => g.studentId === b.id);
                            const editingA = gradeA ? editingGrades.get(gradeA.id) : null;
                            const editingB = gradeB ? editingGrades.get(gradeB.id) : null;
                            
                            const avgA = editingA ? calculateStudentAverage(editingA) : null;
                            const avgB = editingB ? calculateStudentAverage(editingB) : null;
                            
                            if (avgA === null && avgB === null) return 0;
                            if (avgA === null) return 1;
                            if (avgB === null) return -1;
                            return avgB - avgA; // Mayor a menor
                          });
                        }
                        
                        return displayStudents.map((student, index) => {
                        const gradeRecord = courseGrades.find(g => g.studentId === student.id);
                        const editingRecord = gradeRecord ? editingGrades.get(gradeRecord.id) : null;
                        
                        if (!gradeRecord || !editingRecord) return null;

                        const promedio = calculateStudentAverage(editingRecord);

                        return (
                          <TableRow key={student.id}>
                            <TableCell className="border bg-gray-50 text-sm">
                              {sortByMerit && promedio !== null && (
                                <span className="inline-block w-6 text-center mr-2 font-bold text-purple-600">
                                  {index + 1}°
                                </span>
                              )}
                              {student.fullName}
                            </TableCell>
                            
                            {(['unidad1', 'unidad2', 'unidad3', 'unidad4'] as const).map(unidad => {
                              const unitData = editingRecord[unidad] || { tareas: 0, conceptual: 0, examenes: 0 };
                              const finalGrade = unitData ? calculateFinalGrade(unitData) : null;
                              
                              return (
                                <React.Fragment key={unidad}>
                                  {/* Tareas 30% */}
                                  <TableCell className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="20"
                                      step="1"
                                      value={unitData.tareas || ''}
                                      onChange={(e) => handleGradeChange(gradeRecord.id, unidad, 'tareas', e.target.value)}
                                      className="w-16 h-8 text-center text-xs"
                                      placeholder="0"
                                    />
                                  </TableCell>
                                  {/* Conceptual 30% */}
                                  <TableCell className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="20"
                                      step="1"
                                      value={unitData.conceptual || ''}
                                      onChange={(e) => handleGradeChange(gradeRecord.id, unidad, 'conceptual', e.target.value)}
                                      className="w-16 h-8 text-center text-xs"
                                      placeholder="0"
                                    />
                                  </TableCell>
                                  {/* Exámenes 40% */}
                                  <TableCell className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="20"
                                      step="1"
                                      value={unitData.examenes || ''}
                                      onChange={(e) => handleGradeChange(gradeRecord.id, unidad, 'examenes', e.target.value)}
                                      className="w-16 h-8 text-center text-xs"
                                      placeholder="0"
                                    />
                                  </TableCell>
                                  {/* Promedio de la unidad con colores */}
                                  <TableCell className="border text-center bg-purple-50">
                                    {finalGrade !== null && finalGrade > 0 ? (
                                      <Badge 
                                        className={`text-xs ${
                                          finalGrade >= 11 
                                            ? 'bg-green-100 text-green-800 border-green-300' 
                                            : 'bg-red-100 text-red-800 border-red-300'
                                        }`}
                                      >
                                        {finalGrade.toFixed(1)}
                                      </Badge>
                                    ) : (
                                      <span className="text-xs text-gray-400">-</span>
                                    )}
                                  </TableCell>
                                </React.Fragment>
                              );
                            })}
                            
                            {/* Promedio Final con colores */}
                            <TableCell className="border text-center bg-green-50">
                              {promedio !== null ? (
                                <Badge 
                                  className={`text-sm font-bold ${
                                    promedio >= 11 
                                      ? 'bg-green-500 text-white border-green-600' 
                                      : 'bg-red-500 text-white border-red-600'
                                  }`}
                                >
                                  {promedio.toFixed(1)}
                                </Badge>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })})()}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Botón del menú lateral en móviles */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Mis Cursos</SheetTitle>
                      <SheetDescription>
                        Cambiar rápidamente entre cursos
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-2">
                      {teacherCourses.map(course => {
                        const isActive = selectedCourse === course.id;
                        return (
                          <Button
                            key={course.id}
                            variant={isActive ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedCourse(course.id)}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            <div className="text-left flex-1">
                              <div className="text-sm">{course.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {getGradeName(course.gradeId)}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Portal del Docente</p>
                  <h1 className="text-2xl">{user.name}</h1>
                </div>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Barra lateral para desktop */}
          <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-73px)] p-4">
            <div className="sticky top-4">
              <h2 className="text-sm uppercase text-gray-500 mb-3">Mis Cursos</h2>
              <div className="space-y-2">
                {teacherCourses.map(course => {
                  const isActive = selectedCourse === course.id;
                  const students = getCourseStudents(course.id);
                  return (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen className={`h-4 w-4 mt-0.5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{course.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {getGradeName(course.gradeId)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {students.length} estudiantes
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToCourses}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ver Todos
                </Button>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Button
              variant="outline"
              onClick={handleBackToCourses}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Cursos
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Calificaciones</CardTitle>
                    <CardDescription>
                      {getCourseName(selectedCourse)} - {courseInfo ? getGradeName(courseInfo.gradeId) : ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Alerta de estudiantes en riesgo */}
                {getStudentsAtRisk().length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Estudiantes en Riesgo</AlertTitle>
                    <AlertDescription>
                      {getStudentsAtRisk().length} estudiante{getStudentsAtRisk().length > 1 ? 's tienen' : ' tiene'} un promedio menor a 11:
                      <ul className="mt-2 ml-4 list-disc">
                        {getStudentsAtRisk().slice(0, 3).map(({ student, average }) => (
                          <li key={student.id}>
                            {student.fullName}: <strong>{average.toFixed(1)}</strong>
                          </li>
                        ))}
                        {getStudentsAtRisk().length > 3 && (
                          <li className="text-gray-500">y {getStudentsAtRisk().length - 3} más...</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                  <p><strong>Sistema de evaluación:</strong> Tareas (30%) + Conceptual (30%) + Exámenes (40%) = Nota Final (0-20)</p>
                  <p className="mt-1"><strong>Nota:</strong> El promedio final solo aparece cuando las 4 unidades están completas</p>
                </div>

                {/* Mostrar una tabla para cada sección */}
                <div className="space-y-8">
                  {sections.map(section => {
                    const currentPage = currentPages[section] || 1;
                    const totalStudents = studentsBySection[section].length;
                    const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const endIndex = startIndex + ITEMS_PER_PAGE;
                    const paginatedStudents = studentsBySection[section].slice(startIndex, endIndex);

                    return (
                    <div key={section} className="space-y-4">
                      <div className="flex items-center justify-between bg-purple-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg">Sección {section}</h3>
                          <Badge variant="outline">{studentsBySection[section].length} estudiantes</Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingSection(section);
                            setIsEditMode(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Modificar Notas
                        </Button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="sticky left-0 bg-white z-10 min-w-[200px]">Estudiante</TableHead>
                              {[1, 2, 3, 4].map(unit => (
                                <TableHead key={`unit-${unit}`} className="text-center bg-purple-50">Unidad {unit}</TableHead>
                              ))}
                              <TableHead className="text-center bg-green-50">Promedio<br/>Final</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedStudents.map(student => {
                              const gradeRecord = courseGrades.find(g => g.studentId === student.id);
                              const editingRecord = gradeRecord ? editingGrades.get(gradeRecord.id) : null;
                              
                              if (!gradeRecord || !editingRecord) return null;

                              const promedio = calculateStudentAverage(editingRecord);

                              return (
                                <TableRow key={student.id}>
                                  <TableCell className="sticky left-0 bg-white z-10">{student.fullName}</TableCell>
                                  
                                  {(['unidad1', 'unidad2', 'unidad3', 'unidad4'] as const).map(unidad => {
                                    const unitData = editingRecord[unidad];
                                    const finalGrade = unitData ? calculateFinalGrade(unitData) : null;
                                    
                                    return (
                                      <TableCell key={unidad} className="text-center bg-purple-50">
                                        {finalGrade !== null ? (
                                          <Badge className={getGradeColor(finalGrade)}>
                                            {finalGrade.toFixed(1)}
                                          </Badge>
                                        ) : (
                                          <span className="text-gray-400">-</span>
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                  
                                  <TableCell className="text-center bg-green-50">
                                    {promedio !== null ? (
                                      <Badge className={getGradeColor(promedio)}>
                                        {promedio.toFixed(1)}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Paginación */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Mostrando {startIndex + 1} - {Math.min(endIndex, totalStudents)} de {totalStudents} estudiantes
                          </p>
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => {
                                    if (currentPage > 1) {
                                      setCurrentPages(prev => ({ ...prev, [section]: currentPage - 1 }));
                                    }
                                  }}
                                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                // Mostrar solo algunas páginas cercanas a la actual
                                if (
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => setCurrentPages(prev => ({ ...prev, [section]: page }))}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  page === currentPage - 2 ||
                                  page === currentPage + 2
                                ) {
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}
                              
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => {
                                    if (currentPage < totalPages) {
                                      setCurrentPages(prev => ({ ...prev, [section]: currentPage + 1 }));
                                    }
                                  }}
                                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal con lista de cursos
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Portal del Docente</h1>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Selector de Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos Asignados</CardTitle>
            <CardDescription>
              Selecciona un curso para gestionar las calificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherCourses.map(course => {
                const gradeInfo = courses.find(c => c.id === course.id);
                return (
                  <Card
                    key={course.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-purple-600"
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{course.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {getGradeName(course.gradeId)}
                          </CardDescription>
                        </div>
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {getCourseStudents(course.id).length} estudiantes
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}