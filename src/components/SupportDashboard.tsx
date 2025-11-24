import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogOut, Settings, Users, GraduationCap, BookOpen, Plus, Edit, Trash2, Save, X, Filter, Menu } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { SmartPagination } from './SmartPagination';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { toast } from 'sonner@2.0.3';
import {
  getAllStudents,
  getAllTeachers,
  getAllCourses,
  addStudent,
  updateStudent,
  deleteStudent,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  addCourse,
  updateCourse,
  deleteCourse,
  generateStudentId,
  generateTeacherId,
  formatFullName,
  generateEmail,
  getStudentRanking,
  validatePassword,
  grades,
  initializeGradesStorage,
  type Student,
  type Teacher,
  type Course
} from '../utils/mockDatabase';

interface SupportDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function SupportDashboard({ user, accessToken, onLogout }: SupportDashboardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Filtros
  const [studentGradeFilter, setStudentGradeFilter] = useState<string>('all');
  const [studentSectionFilter, setStudentSectionFilter] = useState<string>('all');
  const [courseGradeFilter, setCourseGradeFilter] = useState<string>('all');
  const [courseTeacherFilter, setCourseTeacherFilter] = useState<string>('all');
  
  // Paginación
  const [studentsPage, setStudentsPage] = useState<number>(1);
  const [teachersPage, setTeachersPage] = useState<number>(1);
  const [coursesPage, setCoursesPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;
  
  // Estados para diálogos
  const [studentDialog, setStudentDialog] = useState(false);
  const [teacherDialog, setTeacherDialog] = useState(false);
  const [courseDialog, setCourseDialog] = useState(false);
  
  // Estados para edición
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Estados para formularios de estudiante
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    enrollmentYear: new Date().getFullYear(),
    gradeId: 'g1',
    section: 'A' as 'A' | 'B',
    password: '',
    confirmPassword: ''
  });
  
  // Estados para formularios de docente
  const [teacherForm, setTeacherForm] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    specialty: '',
    password: '',
    confirmPassword: ''
  });
  
  const [courseForm, setCourseForm] = useState({
    id: '',
    name: '',
    gradeId: 'g1',
    teacherId: ''
  });

  useEffect(() => {
    initializeGradesStorage();
    loadData();
  }, []);

  const loadData = () => {
    const loadedStudents = getAllStudents() || [];
    const loadedTeachers = getAllTeachers() || [];
    const loadedCourses = getAllCourses() || [];
    
    setStudents(loadedStudents);
    setTeachers(loadedTeachers);
    setCourses(loadedCourses);
  };

  // Funciones para Estudiantes
  const handleOpenStudentDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({
        firstName: student.firstName,
        paternalLastName: student.paternalLastName,
        maternalLastName: student.maternalLastName,
        enrollmentYear: student.enrollmentYear,
        gradeId: student.gradeId,
        section: student.section,
        password: '',
        confirmPassword: ''
      });
    } else {
      setEditingStudent(null);
      setStudentForm({
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        enrollmentYear: new Date().getFullYear(),
        gradeId: 'g1',
        section: 'A',
        password: '',
        confirmPassword: ''
      });
    }
    setStudentDialog(true);
  };

  const handleSaveStudent = () => {
    if (!studentForm.firstName || !studentForm.paternalLastName || !studentForm.maternalLastName) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar contraseña solo al crear nuevo estudiante
    if (!editingStudent) {
      if (!studentForm.password) {
        toast.error('La contraseña es obligatoria');
        return;
      }

      const passwordValidation = validatePassword(studentForm.password);
      if (!passwordValidation.valid) {
        toast.error(passwordValidation.message);
        return;
      }

      if (studentForm.password !== studentForm.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
      
      // Validar que el ID no exista
      const id = generateStudentId(
        studentForm.firstName,
        studentForm.paternalLastName,
        studentForm.maternalLastName,
        studentForm.enrollmentYear
      );
      
      const allStudents = getAllStudents();
      const allTeachers = getAllTeachers();
      
      if (allStudents.some(s => s.id === id) || allTeachers.some(t => t.id === id)) {
        toast.error('Ya existe un usuario con ese ID. Por favor use datos diferentes.');
        return;
      }
    }

    if (editingStudent) {
      const updatedStudent: Student = {
        ...editingStudent,
        firstName: studentForm.firstName,
        paternalLastName: studentForm.paternalLastName,
        maternalLastName: studentForm.maternalLastName,
        fullName: formatFullName(studentForm.firstName, studentForm.paternalLastName, studentForm.maternalLastName),
        gradeId: studentForm.gradeId,
        section: studentForm.section,
        enrollmentYear: studentForm.enrollmentYear,
        password: studentForm.password || editingStudent.password
      };
      updateStudent(updatedStudent);
      toast.success('Estudiante actualizado correctamente');
    } else {
      const id = generateStudentId(
        studentForm.firstName,
        studentForm.paternalLastName,
        studentForm.maternalLastName,
        studentForm.enrollmentYear
      );
      
      const newStudent: Student = {
        id,
        firstName: studentForm.firstName,
        paternalLastName: studentForm.paternalLastName,
        maternalLastName: studentForm.maternalLastName,
        fullName: formatFullName(studentForm.firstName, studentForm.paternalLastName, studentForm.maternalLastName),
        email: generateEmail(id),
        password: studentForm.password,
        gradeId: studentForm.gradeId,
        section: studentForm.section,
        enrollmentYear: studentForm.enrollmentYear,
        role: 'student'
      };
      
      addStudent(newStudent);
      toast.success(`Estudiante creado. ID: ${id}, Email: ${newStudent.email}`);
    }

    setStudentDialog(false);
    loadData();
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('¿Está seguro de eliminar este estudiante? Se eliminarán también sus calificaciones.')) {
      deleteStudent(studentId);
      toast.success('Estudiante eliminado correctamente');
      loadData();
    }
  };

  // Funciones para Docentes
  const handleOpenTeacherDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({
        firstName: teacher.firstName,
        paternalLastName: teacher.paternalLastName,
        maternalLastName: teacher.maternalLastName,
        specialty: teacher.specialty,
        password: '',
        confirmPassword: ''
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        specialty: '',
        password: '',
        confirmPassword: ''
      });
    }
    setTeacherDialog(true);
  };

  const handleSaveTeacher = () => {
    if (!teacherForm.firstName || !teacherForm.paternalLastName || !teacherForm.maternalLastName || !teacherForm.specialty) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar contraseña solo al crear nuevo docente
    if (!editingTeacher) {
      if (!teacherForm.password) {
        toast.error('La contraseña es obligatoria');
        return;
      }

      const passwordValidation = validatePassword(teacherForm.password);
      if (!passwordValidation.valid) {
        toast.error(passwordValidation.message);
        return;
      }

      if (teacherForm.password !== teacherForm.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
      
      // Validar que el ID no exista
      const id = generateTeacherId(
        teacherForm.firstName,
        teacherForm.paternalLastName,
        teacherForm.maternalLastName
      );
      
      const allStudents = getAllStudents();
      const allTeachers = getAllTeachers();
      
      if (allStudents.some(s => s.id === id) || allTeachers.some(t => t.id === id)) {
        toast.error('Ya existe un usuario con ese ID. Por favor use datos diferentes.');
        return;
      }
    }

    if (editingTeacher) {
      const updatedTeacher: Teacher = {
        ...editingTeacher,
        firstName: teacherForm.firstName,
        paternalLastName: teacherForm.paternalLastName,
        maternalLastName: teacherForm.maternalLastName,
        fullName: formatFullName(teacherForm.firstName, teacherForm.paternalLastName, teacherForm.maternalLastName),
        specialty: teacherForm.specialty,
        password: teacherForm.password || editingTeacher.password
      };
      updateTeacher(updatedTeacher);
      toast.success('Docente actualizado correctamente');
    } else {
      const id = generateTeacherId(
        teacherForm.firstName,
        teacherForm.paternalLastName,
        teacherForm.maternalLastName
      );
      
      const newTeacher: Teacher = {
        id,
        firstName: teacherForm.firstName,
        paternalLastName: teacherForm.paternalLastName,
        maternalLastName: teacherForm.maternalLastName,
        fullName: formatFullName(teacherForm.firstName, teacherForm.paternalLastName, teacherForm.maternalLastName),
        email: generateEmail(id),
        password: teacherForm.password,
        specialty: teacherForm.specialty,
        role: 'teacher'
      };
      
      addTeacher(newTeacher);
      toast.success(`Docente creado. ID: ${id}, Email: ${newTeacher.email}`);
    }

    setTeacherDialog(false);
    loadData();
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm('¿Está seguro de eliminar este docente?')) {
      deleteTeacher(teacherId);
      toast.success('Docente eliminado correctamente');
      loadData();
    }
  };

  // Funciones para Cursos
  const handleOpenCourseDialog = (course?: Course) => {
    if (!course && teachers.length === 0) {
      toast.error('Debe crear al menos un docente antes de crear un curso');
      return;
    }
    
    if (course) {
      setEditingCourse(course);
      setCourseForm(course);
    } else {
      setEditingCourse(null);
      const firstTeacherId = teachers.length > 0 && teachers[0] ? teachers[0].id : '';
      setCourseForm({
        id: `c${Date.now()}`,
        name: '',
        gradeId: 'g1',
        teacherId: firstTeacherId
      });
    }
    setCourseDialog(true);
  };

  const handleSaveCourse = () => {
    if (!courseForm.name) {
      toast.error('Por favor ingrese el nombre del curso');
      return;
    }
    
    if (!courseForm.teacherId) {
      toast.error('Por favor seleccione un docente. Si no hay docentes, cree uno primero.');
      return;
    }

    if (editingCourse) {
      updateCourse(courseForm);
      toast.success('Curso actualizado correctamente');
    } else {
      addCourse(courseForm);
      toast.success('Curso creado correctamente');
    }

    setCourseDialog(false);
    loadData();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('¿Está seguro de eliminar este curso? Se eliminarán también las calificaciones asociadas.')) {
      deleteCourse(courseId);
      toast.success('Curso eliminado correctamente');
      loadData();
    }
  };

  const getGradeName = (gradeId: string) => {
    const grade = grades.find(g => g.id === gradeId);
    return grade ? grade.name : gradeId;
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t && t.id === teacherId);
    return teacher && teacher.fullName ? teacher.fullName : 'Sin asignar';
  };

  // Filtrado de datos
  const filteredStudents = students
    .filter(s => s && s.fullName) // Asegurar que el estudiante y fullName existen
    .filter(s => studentGradeFilter === 'all' || s.gradeId === studentGradeFilter)
    .filter(s => studentSectionFilter === 'all' || s.section === studentSectionFilter)
    .sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'es'));

  const filteredCourses = courses
    .filter(c => c && c.name) // Asegurar que el curso y name existen
    .filter(c => courseGradeFilter === 'all' || c.gradeId === courseGradeFilter)
    .filter(c => courseTeacherFilter === 'all' || c.teacherId === courseTeacherFilter)
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'));

  const sortedTeachers = teachers
    .filter(t => t && t.fullName) // Asegurar que el docente y fullName existen
    .sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'es'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Panel de Soporte Técnico</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Docentes</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{teachers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{courses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total activos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de gestión */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="teachers">Docentes</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>

          {/* Tab de Estudiantes */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Estudiantes</CardTitle>
                    <CardDescription>
                      Crear, modificar y eliminar estudiantes del sistema
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleOpenStudentDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Estudiante
                  </Button>
                </div>
                
                {/* Filtros */}
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Grado</Label>
                    <Select value={studentGradeFilter} onValueChange={setStudentGradeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los grados</SelectItem>
                        {grades.map(grade => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Sección</Label>
                    <Select value={studentSectionFilter} onValueChange={setStudentSectionFilter}>
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre Completo</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Sección</TableHead>
                        <TableHead>Año Ingreso</TableHead>
                        <TableHead>Ranking</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.slice((studentsPage - 1) * ITEMS_PER_PAGE, studentsPage * ITEMS_PER_PAGE).map((student) => {
                        const ranking = getStudentRanking(student.id, student.gradeId, student.section);
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono text-xs">{student.id}</TableCell>
                            <TableCell>{student.fullName}</TableCell>
                            <TableCell className="text-xs text-gray-600">{student.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{getGradeName(student.gradeId)}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{student.section}</Badge>
                            </TableCell>
                            <TableCell>{student.enrollmentYear}</TableCell>
                            <TableCell>
                              {ranking ? (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {ranking}° puesto
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-xs">Sin ranking</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenStudentDialog(student)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <SmartPagination
                  totalItems={filteredStudents.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={studentsPage}
                  onPageChange={setStudentsPage}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Docentes */}
          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Docentes</CardTitle>
                    <CardDescription>
                      Crear, modificar y eliminar docentes del sistema
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleOpenTeacherDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Docente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre Completo</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Especialidad</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTeachers.slice((teachersPage - 1) * ITEMS_PER_PAGE, teachersPage * ITEMS_PER_PAGE).map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-mono text-xs">{teacher.id}</TableCell>
                          <TableCell>{teacher.fullName}</TableCell>
                          <TableCell className="text-xs text-gray-600">{teacher.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{teacher.specialty}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenTeacherDialog(teacher)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTeacher(teacher.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <SmartPagination
                  totalItems={sortedTeachers.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={teachersPage}
                  onPageChange={setTeachersPage}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Cursos */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Cursos</CardTitle>
                    <CardDescription>
                      Crear, modificar y eliminar cursos del sistema
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleOpenCourseDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Curso
                  </Button>
                </div>
                
                {/* Filtros */}
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Grado</Label>
                    <Select value={courseGradeFilter} onValueChange={setCourseGradeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los grados</SelectItem>
                        {grades.map(grade => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Docente</Label>
                    <Select value={courseTeacherFilter} onValueChange={setCourseTeacherFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los docentes</SelectItem>
                        {teachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Docente</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.slice((coursesPage - 1) * ITEMS_PER_PAGE, coursesPage * ITEMS_PER_PAGE).map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getGradeName(course.gradeId)}</Badge>
                          </TableCell>
                          <TableCell>{getTeacherName(course.teacherId)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenCourseDialog(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <SmartPagination
                  totalItems={filteredCourses.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={coursesPage}
                  onPageChange={setCoursesPage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para Estudiantes */}
      <Dialog open={studentDialog} onOpenChange={setStudentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del estudiante. El ID y correo se generarán automáticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-paternal">Apellido Paterno</Label>
              <Input
                id="student-paternal"
                value={studentForm.paternalLastName}
                onChange={(e) => setStudentForm({ ...studentForm, paternalLastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-maternal">Apellido Materno</Label>
              <Input
                id="student-maternal"
                value={studentForm.maternalLastName}
                onChange={(e) => setStudentForm({ ...studentForm, maternalLastName: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="student-firstname">Nombres</Label>
              <Input
                id="student-firstname"
                value={studentForm.firstName}
                onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-year">Año de Ingreso</Label>
              <Input
                id="student-year"
                type="number"
                value={studentForm.enrollmentYear}
                onChange={(e) => setStudentForm({ ...studentForm, enrollmentYear: parseInt(e.target.value) })}
                placeholder="2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-grade">Grado</Label>
              <Select
                value={studentForm.gradeId}
                onValueChange={(value) => setStudentForm({ ...studentForm, gradeId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-section">Sección</Label>
              <Select
                value={studentForm.section}
                onValueChange={(value: 'A' | 'B') => setStudentForm({ ...studentForm, section: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Sección A</SelectItem>
                  <SelectItem value="B">Sección B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {/* Espacio vacío para alineación */}
            </div>
            
            {!editingStudent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Contraseña *</Label>
                  <Input
                    id="student-password"
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <p className="text-xs text-gray-500">
                    Debe tener al menos 8 caracteres, letras y números
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-confirm-password">Confirmar Contraseña *</Label>
                  <Input
                    id="student-confirm-password"
                    type="password"
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                    placeholder="Repita la contraseña"
                  />
                </div>
              </>
            )}
            
            {!editingStudent && studentForm.firstName && studentForm.paternalLastName && studentForm.maternalLastName && (
              <div className="col-span-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Vista previa:</strong>
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  ID: {generateStudentId(studentForm.firstName, studentForm.paternalLastName, studentForm.maternalLastName, studentForm.enrollmentYear)}
                </p>
                <p className="text-sm text-blue-900">
                  Email: {generateEmail(generateStudentId(studentForm.firstName, studentForm.paternalLastName, studentForm.maternalLastName, studentForm.enrollmentYear))}
                </p>
                <p className="text-sm text-blue-900">
                  Nombre: {formatFullName(studentForm.firstName, studentForm.paternalLastName, studentForm.maternalLastName)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveStudent}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Docentes */}
      <Dialog open={teacherDialog} onOpenChange={setTeacherDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? 'Editar Docente' : 'Nuevo Docente'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del docente. El ID y correo se generarán automáticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-paternal">Apellido Paterno</Label>
              <Input
                id="teacher-paternal"
                value={teacherForm.paternalLastName}
                onChange={(e) => setTeacherForm({ ...teacherForm, paternalLastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-maternal">Apellido Materno</Label>
              <Input
                id="teacher-maternal"
                value={teacherForm.maternalLastName}
                onChange={(e) => setTeacherForm({ ...teacherForm, maternalLastName: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="teacher-firstname">Nombres</Label>
              <Input
                id="teacher-firstname"
                value={teacherForm.firstName}
                onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="teacher-specialty">Especialidad</Label>
              <Input
                id="teacher-specialty"
                value={teacherForm.specialty}
                onChange={(e) => setTeacherForm({ ...teacherForm, specialty: e.target.value })}
              />
            </div>
            
            {!editingTeacher && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Contraseña *</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <p className="text-xs text-gray-500">
                    Debe tener al menos 8 caracteres, letras y números
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-confirm-password">Confirmar Contraseña *</Label>
                  <Input
                    id="teacher-confirm-password"
                    type="password"
                    value={teacherForm.confirmPassword}
                    onChange={(e) => setTeacherForm({ ...teacherForm, confirmPassword: e.target.value })}
                    placeholder="Repita la contraseña"
                  />
                </div>
              </>
            )}
            
            {!editingTeacher && teacherForm.firstName && teacherForm.paternalLastName && teacherForm.maternalLastName && (
              <div className="col-span-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Vista previa:</strong>
                </p>
                <p className="text-sm text-blue-900 mt-1">
                  Nombre: {formatFullName(teacherForm.firstName, teacherForm.paternalLastName, teacherForm.maternalLastName)}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  El ID y email se generarán al guardar
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeacherDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveTeacher}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Cursos */}
      <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del curso
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course-name">Nombre del curso</Label>
              <Input
                id="course-name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                placeholder="Matemática"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-grade">Grado</Label>
              <Select
                value={courseForm.gradeId}
                onValueChange={(value) => setCourseForm({ ...courseForm, gradeId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-teacher">Docente asignado</Label>
              <Select
                value={courseForm.teacherId}
                onValueChange={(value) => setCourseForm({ ...courseForm, teacherId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teachers.filter(t => t && t.id).map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.fullName || 'Sin nombre'} - {teacher.specialty || 'Sin especialidad'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}