import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { BarChart3 } from 'lucide-react';

interface Grade {
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  grade: number;
  period: string;
  teacherId: string;
  teacherName: string;
  date: string;
}

interface GradesTableProps {
  grades: Grade[];
  isLoading: boolean;
}

export function GradesTable({ grades, isLoading }: GradesTableProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 70) return 'bg-blue-100 text-blue-800';
    if (grade >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay calificaciones registradas</p>
        <p className="text-sm text-gray-500 mt-2">
          Usa el botón "Nueva Calificación" para registrar notas
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Materia</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Calificación</TableHead>
            <TableHead>Docente</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade, index) => (
            <TableRow key={index}>
              <TableCell>{grade.studentName}</TableCell>
              <TableCell>{grade.subjectName}</TableCell>
              <TableCell>
                <Badge variant="outline">{grade.period}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getGradeColor(grade.grade)}>
                  {grade.grade}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {grade.teacherName}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {new Date(grade.date).toLocaleDateString('es-ES')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
