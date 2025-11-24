import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface Subject {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
}

interface SubjectManagerProps {
  subjects: Subject[];
  accessToken: string;
  onSubjectCreated: () => void;
}

export function SubjectManager({ subjects, accessToken, onSubjectCreated }: SubjectManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8107ac42/subjects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ name: subjectName })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la materia');
      }

      toast.success('Materia creada exitosamente');
      setSubjectName('');
      setShowForm(false);
      onSubjectCreated();
    } catch (error) {
      console.error('Error creando materia:', error);
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Materias</CardTitle>
            <CardDescription>
              {subjects.length} {subjects.length === 1 ? 'materia creada' : 'materias creadas'}
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancelar' : 'Nueva Materia'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Nombre de la Materia</Label>
                <Input
                  id="subject-name"
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Ej: Matemáticas, Historia, Ciencias..."
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creando...' : 'Crear Materia'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay materias creadas</p>
            <p className="text-sm text-gray-500 mt-2">
              Crea tu primera materia para empezar a registrar calificaciones
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{subject.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {subject.teacherName}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
