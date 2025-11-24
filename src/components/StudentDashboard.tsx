import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { LogOut, BookOpen, TrendingUp, Award, Eye, EyeOff } from 'lucide-react';
import {
  getStudentGrades,
  calculateUnitGrade,
  initializeGradesStorage,
  getCourseName,
  getAllStudents,
  getStudentRanking,
  getGradeName,
  type StudentGrade,
  type GradeComponent
} from '../utils/mockDatabase';

interface StudentDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function StudentDashboard({ user, accessToken, onLogout }: StudentDashboardProps) {
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    initializeGradesStorage();
    loadGrades();
  }, []);

  const loadGrades = () => {
    const grades = getStudentGrades(user.id);
    setStudentGrades(grades);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 18) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 11) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const calculateCourseAverage = (gradeRecord: StudentGrade): number | null => {
    const units = [gradeRecord.unidad1, gradeRecord.unidad2, gradeRecord.unidad3, gradeRecord.unidad4];
    const validUnits = units.filter(u => u !== null) as GradeComponent[];
    
    if (validUnits.length === 0) return null;
    
    const sum = validUnits.reduce((acc, unit) => acc + calculateUnitGrade(unit), 0);
    return Math.round((sum / validUnits.length) * 10) / 10;
  };

  const calculateGeneralAverage = (): number | null => {
    const allAverages: number[] = [];
    
    studentGrades.forEach(record => {
      const avg = calculateCourseAverage(record);
      if (avg !== null) {
        allAverages.push(avg);
      }
    });
    
    if (allAverages.length === 0) return null;
    
    const sum = allAverages.reduce((acc, avg) => acc + avg, 0);
    return Math.round((sum / allAverages.length) * 10) / 10;
  };

  const getBestGrade = (): number | null => {
    const allGrades: number[] = [];
    
    studentGrades.forEach(record => {
      [record.unidad1, record.unidad2, record.unidad3, record.unidad4].forEach(unit => {
        if (unit) {
          allGrades.push(calculateUnitGrade(unit));
        }
      });
    });
    
    return allGrades.length > 0 ? Math.max(...allGrades) : null;
  };

  const generalAvg = calculateGeneralAverage();
  const bestGrade = getBestGrade();
  const coursesWithGrades = studentGrades.filter(record => 
    record.unidad1 || record.unidad2 || record.unidad3 || record.unidad4
  ).length;
  
  // Obtener información del estudiante actual
  const allStudents = getAllStudents();
  const currentStudent = allStudents.find(s => s.id === user.id);
  const ranking = currentStudent ? getStudentRanking(user.id, currentStudent.gradeId, currentStudent.section) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl">{user.name}</h1>
                {currentStudent && (
                  <p className="text-sm text-gray-600">
                    {getGradeName(currentStudent.gradeId)} - Sección {currentStudent.section}
                  </p>
                )}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Promedio General</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{generalAvg !== null ? generalAvg.toFixed(1) : '-'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                De todos tus cursos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Cursos con Notas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{coursesWithGrades}</div>
              <p className="text-xs text-muted-foreground mt-1">
                De {studentGrades.length} cursos totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Orden de Mérito</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{ranking !== null ? `${ranking}°` : '-'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentStudent ? `En tu sección (${currentStudent.section})` : 'En tu sección'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para Vista General y Detallada */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Vista General</TabsTrigger>
            <TabsTrigger value="detailed">Vista Detallada</TabsTrigger>
          </TabsList>

          {/* Vista General */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Mis Calificaciones - Vista General</CardTitle>
                <CardDescription>
                  Nota final por unidad y promedio del curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentGrades.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aún no tienes calificaciones registradas</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead className="text-center">Unidad 1</TableHead>
                          <TableHead className="text-center">Unidad 2</TableHead>
                          <TableHead className="text-center">Unidad 3</TableHead>
                          <TableHead className="text-center">Unidad 4</TableHead>
                          <TableHead className="text-center">Promedio Final</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentGrades.map(record => {
                          const promedio = calculateCourseAverage(record);
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell>{getCourseName(record.courseId)}</TableCell>
                              
                              {(['unidad1', 'unidad2', 'unidad3', 'unidad4'] as const).map(unidad => {
                                const unit = record[unidad];
                                const grade = unit ? calculateUnitGrade(unit) : null;
                                
                                return (
                                  <TableCell key={unidad} className="text-center">
                                    {grade !== null ? (
                                      <Badge className={getGradeColor(grade)}>
                                        {grade.toFixed(1)}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </TableCell>
                                );
                              })}
                              
                              <TableCell className="text-center">
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vista Detallada */}
          <TabsContent value="detailed">
            <Card>
              <CardHeader>
                <CardTitle>Mis Calificaciones - Vista Detallada</CardTitle>
                <CardDescription>
                  Desglose completo: Tareas (30%), Conceptual (30%), Exámenes (40%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentGrades.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aún no tienes calificaciones registradas</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead rowSpan={2} className="border text-center align-middle bg-gray-100 sticky left-0 z-10">
                            Materia
                          </TableHead>
                          {[1, 2, 3, 4].map(unit => (
                            <TableHead key={`header-unit-${unit}`} colSpan={4} className="border text-center bg-indigo-100">
                              unidad {unit}
                            </TableHead>
                          ))}
                          <TableHead rowSpan={2} className="border text-center align-middle bg-green-100">
                            Promedio<br/>final
                          </TableHead>
                        </TableRow>
                        <TableRow>
                          {[1, 2, 3, 4].map(unit => (
                            <React.Fragment key={`subheader-unit-${unit}`}>
                              <TableHead className="border text-center text-xs bg-indigo-50">30%</TableHead>
                              <TableHead className="border text-center text-xs bg-indigo-50">30%</TableHead>
                              <TableHead className="border text-center text-xs bg-indigo-50">40%</TableHead>
                              <TableHead className="border text-center text-xs bg-indigo-50">Prom.</TableHead>
                            </React.Fragment>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentGrades.map(record => {
                          const promedio = calculateCourseAverage(record);
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="border bg-gray-50 sticky left-0 z-10">
                                {getCourseName(record.courseId)}
                              </TableCell>
                              
                              {(['unidad1', 'unidad2', 'unidad3', 'unidad4'] as const).map(unidad => {
                                const unit = record[unidad];
                                const finalGrade = unit ? calculateUnitGrade(unit) : null;
                                
                                return (
                                  <React.Fragment key={unidad}>
                                    {/* Tareas 30% */}
                                    <TableCell className="border text-center text-xs">
                                      {unit && unit.tareas > 0 ? unit.tareas.toFixed(1) : ''}
                                    </TableCell>
                                    {/* Conceptual 30% */}
                                    <TableCell className="border text-center text-xs">
                                      {unit && unit.conceptual > 0 ? unit.conceptual.toFixed(1) : ''}
                                    </TableCell>
                                    {/* Exámenes 40% */}
                                    <TableCell className="border text-center text-xs">
                                      {unit && unit.examenes > 0 ? unit.examenes.toFixed(1) : ''}
                                    </TableCell>
                                    {/* Promedio de la unidad con colores */}
                                    <TableCell className="border text-center bg-indigo-50">
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
                                        ''
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
                                  ''
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
                      <p><strong>Cálculo de nota final:</strong> (Tareas × 30%) + (Conceptual × 30%) + (Exámenes × 40%)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}