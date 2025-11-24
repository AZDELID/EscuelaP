import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LogOut, Shield, BookOpen, Save, ArrowLeft, GraduationCap, Edit, AlertTriangle, ArrowUpDown, Menu, Users, School } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  grades,
  getGradeCourses,
  getCourseStudents,
  getCourseGrades,
  updateStudentGrade,
  calculateUnitGrade,
  initializeGradesStorage,
  getCourseName,
  getTeacherName,
  getRankingBySection,
  students,
  teachers,
  courses,
  type Student,
  type StudentGrade,
  type GradeComponent
} from '../utils/mockDatabase';

interface AdminDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

type ViewState = 'grades' | 'course-summary' | 'course-edit' | 'merit-ranking';

export function AdminDashboard({ user, accessToken, onLogout }: AdminDashboardProps) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('grades');
  const [courseGrades, setCourseGrades] = useState<StudentGrade[]>([]);
  const [editingGrades, setEditingGrades] = useState<Map<string, StudentGrade>>(new Map());
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [sortByMerit, setSortByMerit] = useState<boolean>(false);
  const [showMeritRanking, setShowMeritRanking] = useState<boolean>(false);

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
    
    const editMap = new Map<string, StudentGrade>();
    grades.forEach(grade => {
      editMap.set(grade.id, { ...grade });
    });
    setEditingGrades(editMap);
  };

  const handleGradeClick = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedCourse(null);
    setCurrentView('grades');
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setCurrentView('course-summary');
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setSelectedCourse(null);
    setCurrentView('grades');
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentView('grades');
  };

  const handleEditMode = () => {
    setCurrentView('course-edit');
  };

  const handleCancelEdit = () => {
    // Recargar datos originales
    if (selectedCourse) {
      loadCourseGrades(selectedCourse);
    }
    setCurrentView('course-summary');
  };

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
    setCurrentView('course-summary');
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

  // Función para ordenar estudiantes alfabéticamente por apellido
  const sortStudentsByLastName = (students: Student[]): Student[] => {
    return [...students].sort((a, b) => {
      // Los estudiantes ya tienen formato "Apellidos, Nombres"
      return a.fullName.localeCompare(b.fullName, 'es');
    });
  };

  // Función para filtrar y ordenar estudiantes
  const filterAndSortStudents = (students: Student[]): Student[] => {
    // Filtrar por sección
    let filtered = students;
    if (sectionFilter !== 'all') {
      filtered = students.filter(s => s.section === sectionFilter);
    }

    // Ordenar
    if (sortByMerit) {
      // Ordenar por promedio (de mayor a menor)
      return [...filtered].sort((a, b) => {
        const gradeA = courseGrades.find(g => g.studentId === a.id);
        const gradeB = courseGrades.find(g => g.studentId === b.id);
        
        const avgA = gradeA ? calculateStudentAverage(gradeA) : null;
        const avgB = gradeB ? calculateStudentAverage(gradeB) : null;
        
        if (avgA === null && avgB === null) return 0;
        if (avgA === null) return 1;
        if (avgB === null) return -1;
        
        return avgB - avgA; // Mayor a menor
      });
    } else {
      // Ordenar alfabéticamente
      return sortStudentsByLastName(filtered);
    }
  };

  // Función para exportar calificaciones a CSV
  const exportToCSV = () => {
    if (!selectedCourse) return;
    
    const courseStudents = getCourseStudents(selectedCourse);
    const courseName = getCourseName(selectedCourse);
    const gradeName = grades.find(g => g.id === selectedGrade)?.name || 'Grado';
    
    // Crear encabezados CSV
    let csv = 'Estudiante,Unidad 1,Tareas 1,Conceptual 1,Exámenes 1,Unidad 2,Tareas 2,Conceptual 2,Exámenes 2,Unidad 3,Tareas 3,Conceptual 3,Exámenes 3,Unidad 4,Tareas 4,Conceptual 4,Exámenes 4,Promedio Final\n';
    
    // Agregar datos de cada estudiante
    sortStudentsByLastName(courseStudents).forEach(student => {
      const gradeRecord = courseGrades.find(g => g.studentId === student.id);
      if (!gradeRecord) return;
      
      const promedio = calculateStudentAverage(gradeRecord);
      
      let row = `"${student.fullName}",`;
      
      // Agregar datos de cada unidad
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
    
    // Crear archivo y descargarlo
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

  // Función para obtener estudiantes en riesgo (promedio < 11)
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

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalCourses = courses.length;

  // Sidebar content component
  const SidebarContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="px-4 mb-4 text-sm uppercase tracking-wider text-[#8c030e]">
          Grados Académicos
        </h2>
        <div className="space-y-1">
          {grades.map((grade) => {
            const gradeCourses = getGradeCourses(grade.id);
            const isGradeActive = selectedGrade === grade.id;
            
            return (
              <div key={grade.id}>
                <button
                  onClick={() => {
                    if (selectedGrade === grade.id) {
                      setSelectedGrade(null);
                      setSelectedCourse(null);
                    } else {
                      handleGradeClick(grade.id);
                    }
                  }}
                  className={`w-full px-4 py-2 text-left transition-colors flex items-center justify-between ${
                    isGradeActive
                      ? 'bg-red-100 text-[#8c030e] border-l-4 border-[#8c030e]'
                      : 'hover:bg-red-50 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {grade.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {gradeCourses.length}
                  </Badge>
                </button>
                
                {/* Mostrar cursos si el grado está seleccionado */}
                {isGradeActive && gradeCourses.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-200">
                    {gradeCourses.map((course) => {
                      const courseStudents = getCourseStudents(course.id);
                      const isCourseActive = selectedCourse === course.id;
                      
                      return (
                        <button
                          key={course.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course.id);
                          }}
                          className={`w-full px-4 py-2 text-sm text-left transition-colors flex items-center justify-between ${
                            isCourseActive
                              ? 'bg-purple-200 text-purple-900'
                              : 'hover:bg-purple-50 text-gray-600'
                          }`}
                        >
                          <span className="truncate">{course.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {courseStudents.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navegación Rápida</SheetTitle>
                    <SheetDescription>
                      Accede rápidamente a cualquier grado y curso
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Panel Administrativo</h1>
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

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r min-h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4">
            <SidebarContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Estudiantes</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Docentes</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{totalTeachers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Grados</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{grades.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Secundaria completa
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Cursos</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{totalCourses}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total activos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Vista de Grados */}
            {!selectedGrade && !selectedCourse && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona un Grado</CardTitle>
                  <CardDescription>
                    Gestión de calificaciones por grado académico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {grades.map(grade => {
                      const gradeCourses = getGradeCourses(grade.id);
                      const gradeStudents = students.filter(s => s.gradeId === grade.id);
                      
                      return (
                        <Card
                          key={grade.id}
                          className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-purple-600"
                          onClick={() => handleGradeClick(grade.id)}
                        >
                          <CardHeader>
                            <CardTitle className="text-base">{grade.name}</CardTitle>
                            <CardDescription>
                              Nivel {grade.level} de Secundaria
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>👥 {gradeStudents.length} estudiantes</p>
                              <p>📚 {gradeCourses.length} cursos</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vista de Cursos del Grado */}
            {selectedGrade && !selectedCourse && (
              <>
                <Button
                  variant="outline"
                  onClick={handleBackToGrades}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Grados
                </Button>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {grades.find(g => g.id === selectedGrade)?.name} - Cursos
                    </CardTitle>
                    <CardDescription>
                      Selecciona un curso para gestionar las calificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getGradeCourses(selectedGrade).map(course => {
                        const courseStudents = getCourseStudents(course.id);
                        const teacher = getTeacherName(course.teacherId);
                        
                        return (
                          <Card
                            key={course.id}
                            className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-purple-600"
                            onClick={() => handleCourseClick(course.id)}
                          >
                            <CardHeader>
                              <CardTitle className="text-base">{course.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {teacher}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600">
                                {courseStudents.length} estudiantes
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Vista Resumen de Notas del Curso (Solo notas finales) */}
            {selectedCourse && currentView === 'course-summary' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleBackToCourses}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Cursos
                </Button>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Calificaciones del Curso</CardTitle>
                        <CardDescription>
                          {getCourseName(selectedCourse)} - {grades.find(g => g.id === selectedGrade)?.name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEditMode}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modificar las Notas
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Filtros y ordenamiento */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Filtrar por Sección</Label>
                        <Select value={sectionFilter} onValueChange={setSectionFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las secciones</SelectItem>
                            <SelectItem value="A">Sección A</SelectItem>
                            <SelectItem value="B">Sección B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant={sortByMerit ? "default" : "outline"}
                          onClick={() => setSortByMerit(!sortByMerit)}
                        >
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          {sortByMerit ? 'Orden: Mérito' : 'Orden: Alfabético'}
                        </Button>
                      </div>
                    </div>

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
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Estudiante</TableHead>
                            <TableHead className="text-center">Unidad 1</TableHead>
                            <TableHead className="text-center">Unidad 2</TableHead>
                            <TableHead className="text-center">Unidad 3</TableHead>
                            <TableHead className="text-center">Unidad 4</TableHead>
                            <TableHead className="text-center bg-green-50">Promedio Final</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterAndSortStudents(getCourseStudents(selectedCourse)).map(student => {
                            const gradeRecord = courseGrades.find(g => g.studentId === student.id);
                            
                            if (!gradeRecord) return null;

                            const promedio = calculateStudentAverage(gradeRecord);

                            return (
                              <TableRow key={student.id}>
                                <TableCell>{student.fullName}</TableCell>
                                
                                {(['unidad1', 'unidad2', 'unidad3', 'unidad4'] as const).map(unidad => {
                                  const unitData = gradeRecord[unidad];
                                  const finalGrade = unitData ? calculateFinalGrade(unitData) : null;
                                  
                                  return (
                                    <TableCell key={unidad} className="text-center">
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
                  </CardContent>
                </Card>
              </>
            )}

            {/* Vista de Edición de Notas del Curso (Detalles completos) */}
            {selectedCourse && currentView === 'course-edit' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Modificar Calificaciones</CardTitle>
                        <CardDescription>
                          {getCourseName(selectedCourse)} - {grades.find(g => g.id === selectedGrade)?.name}
                        </CardDescription>
                      </div>
                      <Button onClick={saveGrades}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Filtros y ordenamiento */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Filtrar por Sección</Label>
                        <Select value={sectionFilter} onValueChange={setSectionFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las secciones</SelectItem>
                            <SelectItem value="A">Sección A</SelectItem>
                            <SelectItem value="B">Sección B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant={sortByMerit ? "default" : "outline"}
                          onClick={() => setSortByMerit(!sortByMerit)}
                        >
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          {sortByMerit ? 'Orden: Mérito' : 'Orden: Alfabético'}
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                      <p><strong>Sistema de evaluación:</strong> Tareas (30%) + Conceptual (30%) + Exámenes (40%) = Nota Final (0-20)</p>
                    </div>

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
                            let displayStudents = filterAndSortStudents(getCourseStudents(selectedCourse));
                            
                            if (sortByMerit) {
                              // Si está en orden de mérito, mostrar el número de posición
                              return displayStudents.map((student, index) => {
                                const gradeRecord = courseGrades.find(g => g.studentId === student.id);
                                const editingRecord = gradeRecord ? editingGrades.get(gradeRecord.id) : null;
                                
                                if (!gradeRecord || !editingRecord) return null;

                                const promedio = calculateStudentAverage(editingRecord);

                                return (
                                  <TableRow key={student.id}>
                                    <TableCell className="border bg-gray-50 text-sm">
                                      {promedio !== null && (
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
                              });
                            } else {
                              // Orden alfabético sin número de posición
                              return displayStudents.map((student) => {
                                const gradeRecord = courseGrades.find(g => g.studentId === student.id);
                                const editingRecord = gradeRecord ? editingGrades.get(gradeRecord.id) : null;
                                
                                if (!gradeRecord || !editingRecord) return null;

                                const promedio = calculateStudentAverage(editingRecord);

                                return (
                                  <TableRow key={student.id}>
                                    <TableCell className="border bg-gray-50 text-sm">
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
                              });
                            }
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}