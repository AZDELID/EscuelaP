import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface GradeFormProps {
  students: Array<{ id: string; name: string; email: string }>;
  subjects: Array<{ id: string; name: string }>;
  accessToken: string;
  onSuccess: () => void;
}

export function GradeForm({ students, subjects, accessToken, onSuccess }: GradeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [period, setPeriod] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const student = students.find(s => s.id === selectedStudent);
    const subject = subjects.find(s => s.id === selectedSubject);

    if (!student || !subject) {
      toast.error('Por favor selecciona un estudiante y una materia');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8107ac42/grades`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            studentId: student.id,
            studentName: student.name,
            subjectId: subject.id,
            subjectName: subject.name,
            grade: Number(grade),
            period
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la calificación');
      }

      toast.success('Calificación registrada exitosamente');
      setSelectedStudent('');
      setSelectedSubject('');
      setGrade('');
      setPeriod('');
      onSuccess();
    } catch (error) {
      console.error('Error creando calificación:', error);
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student">Estudiante</Label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={isLoading}>
            <SelectTrigger id="student">
              <SelectValue placeholder="Selecciona un estudiante" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Materia</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isLoading}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Selecciona una materia" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select value={period} onValueChange={setPeriod} disabled={isLoading}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Selecciona el período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Parcial 1">Parcial 1</SelectItem>
              <SelectItem value="Parcial 2">Parcial 2</SelectItem>
              <SelectItem value="Parcial 3">Parcial 3</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
              <SelectItem value="Recuperación">Recuperación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Calificación (0-100)</Label>
          <Input
            id="grade"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="85"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Calificación'}
        </Button>
      </div>
    </form>
  );
}
