// Base de datos completa para el sistema de gestión escolar - Secundaria

export interface Grade {
  id: string;
  name: string;
  level: string;
}

export interface Student {
  id: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  fullName: string; // Formato: "Apellidos, Nombres"
  email: string;
  password: string;
  gradeId: string;
  section: 'A' | 'B';
  enrollmentYear: number;
  role: 'student';
}

export interface Teacher {
  id: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  fullName: string; // Formato: "Apellidos, Nombres"
  email: string;
  password: string;
  role: 'teacher';
  specialty: string;
}

export interface Course {
  id: string;
  name: string;
  gradeId: string;
  teacherId: string;
}

export interface GradeComponent {
  tareas: number;      // 30%
  conceptual: number;  // 30%
  examenes: number;    // 40%
}

export interface StudentGrade {
  id: string;
  studentId: string;
  courseId: string;
  unidad1: GradeComponent | null;
  unidad2: GradeComponent | null;
  unidad3: GradeComponent | null;
  unidad4: GradeComponent | null;
}

// Grados de Secundaria
export const grades: Grade[] = [
  { id: 'g1', name: '1° Secundaria', level: '1' },
  { id: 'g2', name: '2° Secundaria', level: '2' },
  { id: 'g3', name: '3° Secundaria', level: '3' },
  { id: 'g4', name: '4° Secundaria', level: '4' },
  { id: 'g5', name: '5° Secundaria', level: '5' },
];

// Funciones auxiliares para generar IDs y nombres
export const generateStudentId = (
  firstName: string,
  paternalLastName: string,
  maternalLastName: string,
  enrollmentYear: number
): string => {
  const firstNameParts = firstName.trim().split(' ');
  const firstInitial = firstNameParts[0].charAt(0).toUpperCase();
  const restOfFirstName = firstName.replace(/\s+/g, '');
  const maternalInitial = maternalLastName.charAt(0).toUpperCase();
  
  return `${firstInitial}${restOfFirstName}${paternalLastName}${maternalInitial}${enrollmentYear}`;
};

export const generateTeacherId = (
  firstName: string,
  paternalLastName: string,
  maternalLastName: string
): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${firstInitial}${paternalLastName}${maternalLastName.charAt(0)}${timestamp}`;
};

export const formatFullName = (
  firstName: string,
  paternalLastName: string,
  maternalLastName: string
): string => {
  return `${paternalLastName} ${maternalLastName}, ${firstName}`;
};

export const generateEmail = (id: string): string => {
  return `${id}@escuela.com`;
};

// Función para validar nombres duplicados
export const checkDuplicateName = (
  firstName: string,
  paternalLastName: string,
  maternalLastName: string,
  excludeId?: string
): boolean => {
  const allStudents = getAllStudents();
  const allTeachers = getAllTeachers();
  
  const fullName = formatFullName(firstName, paternalLastName, maternalLastName);
  
  const studentExists = allStudents.some(s => 
    s.id !== excludeId && s.fullName.toLowerCase() === fullName.toLowerCase()
  );
  
  const teacherExists = allTeachers.some(t => 
    t.id !== excludeId && t.fullName.toLowerCase() === fullName.toLowerCase()
  );
  
  return studentExists || teacherExists;
};

// Función para validar contraseña
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: 'La contraseña debe incluir letras y números' };
  }
  
  return { valid: true, message: '' };
};

// Docentes con nuevo formato
export const teachers: Teacher[] = [
  {
    id: 'CMendezR01',
    firstName: 'Carlos',
    paternalLastName: 'Méndez',
    maternalLastName: 'Rodríguez',
    fullName: 'Méndez Rodríguez, Carlos',
    email: 'CMendezR01@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Matemáticas'
  },
  {
    id: 'MGonzalezS02',
    firstName: 'María',
    paternalLastName: 'González',
    maternalLastName: 'Silva',
    fullName: 'González Silva, María',
    email: 'MGonzalezS02@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Comunicación'
  },
  {
    id: 'JPerezT03',
    firstName: 'Juan',
    paternalLastName: 'Pérez',
    maternalLastName: 'Torres',
    fullName: 'Pérez Torres, Juan',
    email: 'JPerezT03@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Ciencias'
  },
  {
    id: 'ARodriguezM04',
    firstName: 'Ana',
    paternalLastName: 'Rodríguez',
    maternalLastName: 'Martínez',
    fullName: 'Rodríguez Martínez, Ana',
    email: 'ARodriguezM04@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Historia'
  },
  {
    id: 'LTorresV05',
    firstName: 'Luis',
    paternalLastName: 'Torres',
    maternalLastName: 'Vargas',
    fullName: 'Torres Vargas, Luis',
    email: 'LTorresV05@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Inglés'
  },
  {
    id: 'CSilvaR06',
    firstName: 'Carmen',
    paternalLastName: 'Silva',
    maternalLastName: 'Ramos',
    fullName: 'Silva Ramos, Carmen',
    email: 'CSilvaR06@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Educación Física'
  },
  {
    id: 'RDiazC07',
    firstName: 'Roberto',
    paternalLastName: 'Díaz',
    maternalLastName: 'Castro',
    fullName: 'Díaz Castro, Roberto',
    email: 'RDiazC07@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Arte'
  },
  {
    id: 'PVegaL08',
    firstName: 'Patricia',
    paternalLastName: 'Vega',
    maternalLastName: 'López',
    fullName: 'Vega López, Patricia',
    email: 'PVegaL08@escuela.com',
    password: '12345678',
    role: 'teacher',
    specialty: 'Química'
  },
];

// Cursos por grado
export const courses: Course[] = [
  // 1° Secundaria
  { id: 'c1', name: 'Matemática', gradeId: 'g1', teacherId: 'CMendezR01' },
  { id: 'c2', name: 'Comunicación', gradeId: 'g1', teacherId: 'MGonzalezS02' },
  { id: 'c3', name: 'Ciencia y Tecnología', gradeId: 'g1', teacherId: 'JPerezT03' },
  { id: 'c4', name: 'Ciencias Sociales', gradeId: 'g1', teacherId: 'ARodriguezM04' },
  { id: 'c5', name: 'Inglés', gradeId: 'g1', teacherId: 'LTorresV05' },
  { id: 'c6', name: 'Educación Física', gradeId: 'g1', teacherId: 'CSilvaR06' },
  { id: 'c7', name: 'Arte y Cultura', gradeId: 'g1', teacherId: 'RDiazC07' },
  
  // 2° Secundaria
  { id: 'c8', name: 'Matemática', gradeId: 'g2', teacherId: 'CMendezR01' },
  { id: 'c9', name: 'Comunicación', gradeId: 'g2', teacherId: 'MGonzalezS02' },
  { id: 'c10', name: 'Ciencia y Tecnología', gradeId: 'g2', teacherId: 'JPerezT03' },
  { id: 'c11', name: 'Ciencias Sociales', gradeId: 'g2', teacherId: 'ARodriguezM04' },
  { id: 'c12', name: 'Inglés', gradeId: 'g2', teacherId: 'LTorresV05' },
  { id: 'c13', name: 'Educación Física', gradeId: 'g2', teacherId: 'CSilvaR06' },
  { id: 'c14', name: 'Arte y Cultura', gradeId: 'g2', teacherId: 'RDiazC07' },
  
  // 3° Secundaria
  { id: 'c15', name: 'Matemática', gradeId: 'g3', teacherId: 'CMendezR01' },
  { id: 'c16', name: 'Comunicación', gradeId: 'g3', teacherId: 'MGonzalezS02' },
  { id: 'c17', name: 'Ciencia y Tecnología', gradeId: 'g3', teacherId: 'JPerezT03' },
  { id: 'c18', name: 'Ciencias Sociales', gradeId: 'g3', teacherId: 'ARodriguezM04' },
  { id: 'c19', name: 'Inglés', gradeId: 'g3', teacherId: 'LTorresV05' },
  { id: 'c20', name: 'Educación Física', gradeId: 'g3', teacherId: 'CSilvaR06' },
  { id: 'c21', name: 'Arte y Cultura', gradeId: 'g3', teacherId: 'RDiazC07' },
  
  // 4° Secundaria
  { id: 'c22', name: 'Matemática', gradeId: 'g4', teacherId: 'CMendezR01' },
  { id: 'c23', name: 'Comunicación', gradeId: 'g4', teacherId: 'MGonzalezS02' },
  { id: 'c24', name: 'Ciencia y Tecnología', gradeId: 'g4', teacherId: 'JPerezT03' },
  { id: 'c25', name: 'Ciencias Sociales', gradeId: 'g4', teacherId: 'ARodriguezM04' },
  { id: 'c26', name: 'Inglés', gradeId: 'g4', teacherId: 'LTorresV05' },
  { id: 'c27', name: 'Educación Física', gradeId: 'g4', teacherId: 'CSilvaR06' },
  { id: 'c28', name: 'Arte y Cultura', gradeId: 'g4', teacherId: 'RDiazC07' },
  
  // 5° Secundaria
  { id: 'c29', name: 'Matemática', gradeId: 'g5', teacherId: 'CMendezR01' },
  { id: 'c30', name: 'Comunicación', gradeId: 'g5', teacherId: 'MGonzalezS02' },
  { id: 'c31', name: 'Ciencia y Tecnología', gradeId: 'g5', teacherId: 'JPerezT03' },
  { id: 'c32', name: 'Ciencias Sociales', gradeId: 'g5', teacherId: 'ARodriguezM04' },
  { id: 'c33', name: 'Inglés', gradeId: 'g5', teacherId: 'LTorresV05' },
  { id: 'c34', name: 'Educación Física', gradeId: 'g5', teacherId: 'CSilvaR06' },
  { id: 'c35', name: 'Arte y Cultura', gradeId: 'g5', teacherId: 'RDiazC07' },
];

// Estudiantes - 4 por cada sección (A y B) de cada grado = 40 estudiantes total
export const students: Student[] = [
  // 1° Secundaria - Sección A
  { id: 'JLuisGarciaP2024', firstName: 'Juan Luis', paternalLastName: 'García', maternalLastName: 'Pérez', fullName: 'García Pérez, Juan Luis', email: 'JLuisGarciaP2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'A', enrollmentYear: 2024, role: 'student' },
  { id: 'MCarmenLopezM2024', firstName: 'María Carmen', paternalLastName: 'López', maternalLastName: 'Martínez', fullName: 'López Martínez, María Carmen', email: 'MCarmenLopezM2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'A', enrollmentYear: 2024, role: 'student' },
  { id: 'CAntonioRodriguezS2024', firstName: 'Carlos Antonio', paternalLastName: 'Rodríguez', maternalLastName: 'Silva', fullName: 'Rodríguez Silva, Carlos Antonio', email: 'CAntonioRodriguezS2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'A', enrollmentYear: 2024, role: 'student' },
  { id: 'ASofiaFernandezT2024', firstName: 'Ana Sofía', paternalLastName: 'Fernández', maternalLastName: 'Torres', fullName: 'Fernández Torres, Ana Sofía', email: 'ASofiaFernandezT2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'A', enrollmentYear: 2024, role: 'student' },
  
  // 1° Secundaria - Sección B
  { id: 'JJoseHerreraD2024', firstName: 'Jorge José', paternalLastName: 'Herrera', maternalLastName: 'Díaz', fullName: 'Herrera Díaz, Jorge José', email: 'JJoseHerreraD2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'B', enrollmentYear: 2024, role: 'student' },
  { id: 'CIsabelMendezO2024', firstName: 'Camila Isabel', paternalLastName: 'Méndez', maternalLastName: 'Ortiz', fullName: 'Méndez Ortiz, Camila Isabel', email: 'CIsabelMendezO2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'B', enrollmentYear: 2024, role: 'student' },
  { id: 'RCarlosCruzA2024', firstName: 'Ricardo Carlos', paternalLastName: 'Cruz', maternalLastName: 'Álvarez', fullName: 'Cruz Álvarez, Ricardo Carlos', email: 'RCarlosCruzA2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'B', enrollmentYear: 2024, role: 'student' },
  { id: 'SLuisaFloresG2024', firstName: 'Sofía Luisa', paternalLastName: 'Flores', maternalLastName: 'García', fullName: 'Flores García, Sofía Luisa', email: 'SLuisaFloresG2024@escuela.com', password: '12345678', gradeId: 'g1', section: 'B', enrollmentYear: 2024, role: 'student' },
  
  // 2° Secundaria - Sección A
  { id: 'MLuisMendozaP2023', firstName: 'Manuel Luis', paternalLastName: 'Mendoza', maternalLastName: 'Pérez', fullName: 'Mendoza Pérez, Manuel Luis', email: 'MLuisMendozaP2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'A', enrollmentYear: 2023, role: 'student' },
  { id: 'IMariaRomeroG2023', firstName: 'Isabella María', paternalLastName: 'Romero', maternalLastName: 'García', fullName: 'Romero García, Isabella María', email: 'IMariaRomeroG2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'A', enrollmentYear: 2023, role: 'student' },
  { id: 'JEstebanJimenezL2023', firstName: 'Javier Esteban', paternalLastName: 'Jiménez', maternalLastName: 'López', fullName: 'Jiménez López, Javier Esteban', email: 'JEstebanJimenezL2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'A', enrollmentYear: 2023, role: 'student' },
  { id: 'NVictoriaGutierrezM2023', firstName: 'Natalia Victoria', paternalLastName: 'Gutiérrez', maternalLastName: 'Martínez', fullName: 'Gutiérrez Martínez, Natalia Victoria', email: 'NVictoriaGutierrezM2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'A', enrollmentYear: 2023, role: 'student' },
  
  // 2° Secundaria - Sección B
  { id: 'RRobertoVegaL2023', firstName: 'Raúl Roberto', paternalLastName: 'Vega', maternalLastName: 'León', fullName: 'Vega León, Raúl Roberto', email: 'RRobertoVegaL2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'B', enrollmentYear: 2023, role: 'student' },
  { id: 'VValentinaBlancoH2023', firstName: 'Victoria Valentina', paternalLastName: 'Blanco', maternalLastName: 'Hernández', fullName: 'Blanco Hernández, Victoria Valentina', email: 'VValentinaBlancoH2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'B', enrollmentYear: 2023, role: 'student' },
  { id: 'GGabrielRiveraS2023', firstName: 'Gustavo Gabriel', paternalLastName: 'Rivera', maternalLastName: 'Soto', fullName: 'Rivera Soto, Gustavo Gabriel', email: 'GGabrielRiveraS2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'B', enrollmentYear: 2023, role: 'student' },
  { id: 'CClaraAguilarD2023', firstName: 'Carla Clara', paternalLastName: 'Aguilar', maternalLastName: 'Delgado', fullName: 'Aguilar Delgado, Carla Clara', email: 'CClaraAguilarD2023@escuela.com', password: '12345678', gradeId: 'g2', section: 'B', enrollmentYear: 2023, role: 'student' },
  
  // 3° Secundaria - Sección A
  { id: 'OMarioFuentesA2022', firstName: 'Omar Mario', paternalLastName: 'Fuentes', maternalLastName: 'Acosta', fullName: 'Fuentes Acosta, Omar Mario', email: 'OMarioFuentesA2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'A', enrollmentYear: 2022, role: 'student' },
  { id: 'BBeatrizCamposB2022', firstName: 'Bianca Beatriz', paternalLastName: 'Campos', maternalLastName: 'Benítez', fullName: 'Campos Benítez, Bianca Beatriz', email: 'BBeatrizCamposB2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'A', enrollmentYear: 2022, role: 'student' },
  { id: 'FFabianSotoC2022', firstName: 'Felipe Fabián', paternalLastName: 'Soto', maternalLastName: 'Cortés', fullName: 'Soto Cortés, Felipe Fabián', email: 'FFabianSotoC2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'A', enrollmentYear: 2022, role: 'student' },
  { id: 'GGabrielaPachecoD2022', firstName: 'Gloria Gabriela', paternalLastName: 'Pacheco', maternalLastName: 'Domínguez', fullName: 'Pacheco Domínguez, Gloria Gabriela', email: 'GGabrielaPachecoD2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'A', enrollmentYear: 2022, role: 'student' },
  
  // 3° Secundaria - Sección B
  { id: 'MMarioPrietoJ2022', firstName: 'Mateo Mario', paternalLastName: 'Prieto', maternalLastName: 'Juárez', fullName: 'Prieto Juárez, Mateo Mario', email: 'MMarioPrietoJ2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'B', enrollmentYear: 2022, role: 'student' },
  { id: 'NNataliaEstradaK2022', firstName: 'Nicole Natalia', paternalLastName: 'Estrada', maternalLastName: 'Keller', fullName: 'Estrada Keller, Nicole Natalia', email: 'NNataliaEstradaK2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'B', enrollmentYear: 2022, role: 'student' },
  { id: 'OOctavioPazL2022', firstName: 'Óscar Octavio', paternalLastName: 'Paz', maternalLastName: 'Luna', fullName: 'Paz Luna, Óscar Octavio', email: 'OOctavioPazL2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'B', enrollmentYear: 2022, role: 'student' },
  { id: 'PPaolaBravoM2022', firstName: 'Patricia Paola', paternalLastName: 'Bravo', maternalLastName: 'Montes', fullName: 'Bravo Montes, Patricia Paola', email: 'PPaolaBravoM2022@escuela.com', password: '12345678', gradeId: 'g3', section: 'B', enrollmentYear: 2022, role: 'student' },
  
  // 4° Secundaria - Sección A
  { id: 'UUlisesVelezR2021', firstName: 'Ulises', paternalLastName: 'Vélez', maternalLastName: 'Rivas', fullName: 'Vélez Rivas, Ulises', email: 'UUlisesVelezR2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'A', enrollmentYear: 2021, role: 'student' },
  { id: 'VVanessaLlanosS2021', firstName: 'Valeria Vanessa', paternalLastName: 'Llanos', maternalLastName: 'Sáenz', fullName: 'Llanos Sáenz, Valeria Vanessa', email: 'VVanessaLlanosS2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'A', enrollmentYear: 2021, role: 'student' },
  { id: 'WWalterBarriosT2021', firstName: 'William Walter', paternalLastName: 'Barrios', maternalLastName: 'Trujillo', fullName: 'Barrios Trujillo, William Walter', email: 'WWalterBarriosT2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'A', enrollmentYear: 2021, role: 'student' },
  { id: 'XXimenaUribeU2021', firstName: 'Ximena', paternalLastName: 'Uribe', maternalLastName: 'Uriarte', fullName: 'Uribe Uriarte, Ximena', email: 'XXimenaUribeU2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'A', enrollmentYear: 2021, role: 'student' },
  
  // 4° Secundaria - Sección B
  { id: 'CCesarMejiaZ2021', firstName: 'César', paternalLastName: 'Mejía', maternalLastName: 'Zavala', fullName: 'Mejía Zavala, César', email: 'CCesarMejiaZ2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'B', enrollmentYear: 2021, role: 'student' },
  { id: 'DDanielaOsorioA2021', firstName: 'Daniela', paternalLastName: 'Osorio', maternalLastName: 'Aguirre', fullName: 'Osorio Aguirre, Daniela', email: 'DDanielaOsorioA2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'B', enrollmentYear: 2021, role: 'student' },
  { id: 'EEnriqueQuinteroB2021', firstName: 'Enrique', paternalLastName: 'Quintero', maternalLastName: 'Bautista', fullName: 'Quintero Bautista, Enrique', email: 'EEnriqueQuinteroB2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'B', enrollmentYear: 2021, role: 'student' },
  { id: 'FFabiolaRamirezC2021', firstName: 'Fabiola', paternalLastName: 'Ramírez', maternalLastName: 'Campos', fullName: 'Ramírez Campos, Fabiola', email: 'FFabiolaRamirezC2021@escuela.com', password: '12345678', gradeId: 'g4', section: 'B', enrollmentYear: 2021, role: 'student' },
  
  // 5° Secundaria - Sección A
  { id: 'KKarinaLinaresH2020', firstName: 'Karina', paternalLastName: 'Linares', maternalLastName: 'Huerta', fullName: 'Linares Huerta, Karina', email: 'KKarinaLinaresH2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'A', enrollmentYear: 2020, role: 'student' },
  { id: 'LLeonardoEscalanteI2020', firstName: 'Leonardo', paternalLastName: 'Escalante', maternalLastName: 'Iglesias', fullName: 'Escalante Iglesias, Leonardo', email: 'LLeonardoEscalanteI2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'A', enrollmentYear: 2020, role: 'student' },
  { id: 'MMelisaVillegasJ2020', firstName: 'Melisa', paternalLastName: 'Villegas', maternalLastName: 'Jiménez', fullName: 'Villegas Jiménez, Melisa', email: 'MMelisaVillegasJ2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'A', enrollmentYear: 2020, role: 'student' },
  { id: 'NNicolasArriagaK2020', firstName: 'Nicolás', paternalLastName: 'Arriaga', maternalLastName: 'Klein', fullName: 'Arriaga Klein, Nicolás', email: 'NNicolasArriagaK2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'A', enrollmentYear: 2020, role: 'student' },
  
  // 5° Secundaria - Sección B
  { id: 'SSandraMonroyP2020', firstName: 'Sandra', paternalLastName: 'Monroy', maternalLastName: 'Parra', fullName: 'Monroy Parra, Sandra', email: 'SSandraMonroyP2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'B', enrollmentYear: 2020, role: 'student' },
  { id: 'TTomasVillarrealQ2020', firstName: 'Tomás', paternalLastName: 'Villarreal', maternalLastName: 'Quiroz', fullName: 'Villarreal Quiroz, Tomás', email: 'TTomasVillarrealQ2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'B', enrollmentYear: 2020, role: 'student' },
  { id: 'UUrsulaSantosR2020', firstName: 'Úrsula', paternalLastName: 'Santos', maternalLastName: 'Ríos', fullName: 'Santos Ríos, Úrsula', email: 'UUrsulaSantosR2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'B', enrollmentYear: 2020, role: 'student' },
  { id: 'VVicenteOliveraS2020', firstName: 'Vicente', paternalLastName: 'Olivera', maternalLastName: 'Solís', fullName: 'Olivera Solís, Vicente', email: 'VVicenteOliveraS2020@escuela.com', password: '12345678', gradeId: 'g5', section: 'B', enrollmentYear: 2020, role: 'student' },
];

// Función auxiliar para generar nota aleatoria entre 0-20
const randomGrade = (min: number = 10, max: number = 20): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Función para calcular la nota de una unidad
export const calculateUnitGrade = (components: GradeComponent): number => {
  const grade = (components.tareas * 0.3) + (components.conceptual * 0.3) + (components.examenes * 0.4);
  return Math.round(grade * 10) / 10;
};

// Función para obtener el nombre del grado
export const getGradeName = (gradeId: string): string => {
  const grade = grades.find(g => g.id === gradeId);
  return grade ? grade.name : 'Grado no encontrado';
};

// Storage keys
const GRADES_STORAGE_KEY = 'school_grades_data';
const STUDENTS_STORAGE_KEY = 'school_students_data';
const TEACHERS_STORAGE_KEY = 'school_teachers_data';
const COURSES_STORAGE_KEY = 'school_courses_data';

// Inicializar datos en localStorage
export const initializeAllData = () => {
  if (!localStorage.getItem(STUDENTS_STORAGE_KEY)) {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }
  if (!localStorage.getItem(TEACHERS_STORAGE_KEY)) {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
  }
  if (!localStorage.getItem(COURSES_STORAGE_KEY)) {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }
};

// Inicializar almacenamiento de calificaciones con notas aleatorias
export const initializeGradesStorage = () => {
  initializeAllData();
  
  if (!localStorage.getItem(GRADES_STORAGE_KEY)) {
    const initialGrades: StudentGrade[] = [];
    
    const allStudents = getAllStudents();
    const allCourses = getAllCourses();
    
    allStudents.forEach(student => {
      const studentCourses = allCourses.filter(c => c.gradeId === student.gradeId);
      
      studentCourses.forEach(course => {
        // Generar todas las 4 unidades con notas aleatorias
        const unidad1: GradeComponent = {
          tareas: randomGrade(12, 20),
          conceptual: randomGrade(12, 20),
          examenes: randomGrade(12, 20)
        };
        
        const unidad2: GradeComponent = {
          tareas: randomGrade(11, 20),
          conceptual: randomGrade(11, 20),
          examenes: randomGrade(11, 20)
        };
        
        const unidad3: GradeComponent = {
          tareas: randomGrade(10, 20),
          conceptual: randomGrade(10, 20),
          examenes: randomGrade(10, 20)
        };
        
        const unidad4: GradeComponent = {
          tareas: randomGrade(10, 20),
          conceptual: randomGrade(10, 20),
          examenes: randomGrade(10, 20)
        };
        
        initialGrades.push({
          id: `${student.id}-${course.id}`,
          studentId: student.id,
          courseId: course.id,
          unidad1,
          unidad2,
          unidad3,
          unidad4,
        });
      });
    });
    
    localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(initialGrades));
  }
};

export const getStudentGrades = (studentId: string, courseId?: string): StudentGrade[] => {
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  if (!gradesData) return [];
  
  const allGrades: StudentGrade[] = JSON.parse(gradesData);
  
  if (courseId) {
    return allGrades.filter(g => g.studentId === studentId && g.courseId === courseId);
  }
  
  return allGrades.filter(g => g.studentId === studentId);
};

export const getCourseGrades = (courseId: string): StudentGrade[] => {
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  if (!gradesData) return [];
  
  const allGrades: StudentGrade[] = JSON.parse(gradesData);
  return allGrades.filter(g => g.courseId === courseId);
};

export const updateStudentGrade = (gradeRecord: StudentGrade): void => {
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  if (!gradesData) return;
  
  let allGrades: StudentGrade[] = JSON.parse(gradesData);
  const index = allGrades.findIndex(g => g.id === gradeRecord.id);
  
  if (index !== -1) {
    allGrades[index] = gradeRecord;
  } else {
    allGrades.push(gradeRecord);
  }
  
  localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(allGrades));
};

// Función para obtener los cursos de un docente
export const getTeacherCourses = (teacherId: string): Course[] => {
  const allCourses = getAllCourses();
  return allCourses.filter(c => c.teacherId === teacherId);
};

// Función para obtener los estudiantes de un curso
export const getCourseStudents = (courseId: string): Student[] => {
  const allCourses = getAllCourses();
  const allStudents = getAllStudents();
  const course = allCourses.find(c => c.id === courseId);
  if (!course) return [];
  return allStudents.filter(s => s.gradeId === course.gradeId);
};

// Función para obtener los cursos de un grado
export const getGradeCourses = (gradeId: string): Course[] => {
  const allCourses = getAllCourses();
  return allCourses.filter(c => c.gradeId === gradeId);
};

// Función para obtener el nombre del docente
export const getTeacherName = (teacherId: string): string => {
  const allTeachers = getAllTeachers();
  const teacher = allTeachers.find(t => t.id === teacherId);
  return teacher ? teacher.fullName : 'Docente no encontrado';
};

// Función para obtener el nombre del curso
export const getCourseName = (courseId: string): string => {
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === courseId);
  return course ? course.name : 'Curso no encontrado';
};

// Función para obtener el nombre del estudiante
export const getStudentName = (studentId: string): string => {
  const allStudents = getAllStudents();
  const student = allStudents.find(s => s.id === studentId);
  return student ? student.fullName : 'Estudiante no encontrado';
};

// CRUD para Estudiantes
export const getAllStudents = (): Student[] => {
  try {
    const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : students;
  } catch (error) {
    console.error('Error loading students:', error);
    return students;
  }
};

export const addStudent = (student: Student): void => {
  const allStudents = getAllStudents();
  allStudents.push(student);
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(allStudents));
  
  // Crear registros de calificaciones para el nuevo estudiante
  const allCourses = getAllCourses();
  const studentCourses = allCourses.filter(c => c.gradeId === student.gradeId);
  
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  let allGrades: StudentGrade[] = gradesData ? JSON.parse(gradesData) : [];
  
  studentCourses.forEach(course => {
    allGrades.push({
      id: `${student.id}-${course.id}`,
      studentId: student.id,
      courseId: course.id,
      unidad1: null,
      unidad2: null,
      unidad3: null,
      unidad4: null,
    });
  });
  
  localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(allGrades));
};

export const updateStudent = (student: Student): void => {
  let allStudents = getAllStudents();
  const index = allStudents.findIndex(s => s.id === student.id);
  if (index !== -1) {
    allStudents[index] = student;
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(allStudents));
  }
};

export const deleteStudent = (studentId: string): void => {
  let allStudents = getAllStudents();
  allStudents = allStudents.filter(s => s.id !== studentId);
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(allStudents));
  
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  if (gradesData) {
    let allGrades: StudentGrade[] = JSON.parse(gradesData);
    allGrades = allGrades.filter(g => g.studentId !== studentId);
    localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(allGrades));
  }
};

// CRUD para Docentes
export const getAllTeachers = (): Teacher[] => {
  try {
    const data = localStorage.getItem(TEACHERS_STORAGE_KEY);
    return data ? JSON.parse(data) : teachers;
  } catch (error) {
    console.error('Error loading teachers:', error);
    return teachers;
  }
};

export const addTeacher = (teacher: Teacher): void => {
  const allTeachers = getAllTeachers();
  allTeachers.push(teacher);
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(allTeachers));
};

export const updateTeacher = (teacher: Teacher): void => {
  let allTeachers = getAllTeachers();
  const index = allTeachers.findIndex(t => t.id === teacher.id);
  if (index !== -1) {
    allTeachers[index] = teacher;
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(allTeachers));
  }
};

export const deleteTeacher = (teacherId: string): void => {
  let allTeachers = getAllTeachers();
  allTeachers = allTeachers.filter(t => t.id !== teacherId);
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(allTeachers));
};

// CRUD para Cursos
export const getAllCourses = (): Course[] => {
  try {
    const data = localStorage.getItem(COURSES_STORAGE_KEY);
    return data ? JSON.parse(data) : courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    return courses;
  }
};

export const addCourse = (course: Course): void => {
  const allCourses = getAllCourses();
  allCourses.push(course);
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(allCourses));
  
  // Crear registros de calificaciones para todos los estudiantes del grado
  const allStudents = getAllStudents();
  const gradeStudents = allStudents.filter(s => s.gradeId === course.gradeId);
  
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  let allGrades: StudentGrade[] = gradesData ? JSON.parse(gradesData) : [];
  
  gradeStudents.forEach(student => {
    allGrades.push({
      id: `${student.id}-${course.id}`,
      studentId: student.id,
      courseId: course.id,
      unidad1: null,
      unidad2: null,
      unidad3: null,
      unidad4: null,
    });
  });
  
  localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(allGrades));
};

export const updateCourse = (course: Course): void => {
  let allCourses = getAllCourses();
  const index = allCourses.findIndex(c => c.id === course.id);
  if (index !== -1) {
    allCourses[index] = course;
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(allCourses));
  }
};

export const deleteCourse = (courseId: string): void => {
  let allCourses = getAllCourses();
  allCourses = allCourses.filter(c => c.id !== courseId);
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(allCourses));
  
  const gradesData = localStorage.getItem(GRADES_STORAGE_KEY);
  if (gradesData) {
    let allGrades: StudentGrade[] = JSON.parse(gradesData);
    allGrades = allGrades.filter(g => g.courseId !== courseId);
    localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(allGrades));
  }
};

// Función para calcular el promedio general de un estudiante
export const calculateStudentAverage = (studentId: string, gradeId: string, section: string): number | null => {
  const allGrades = getStudentGrades(studentId);
  const allCourses = getAllCourses();
  
  let totalSum = 0;
  let totalCount = 0;
  
  allGrades.forEach(gradeRecord => {
    const course = allCourses.find(c => c.id === gradeRecord.courseId);
    if (!course || course.gradeId !== gradeId) return;
    
    const units = [gradeRecord.unidad1, gradeRecord.unidad2, gradeRecord.unidad3, gradeRecord.unidad4];
    const validUnits = units.filter(u => u !== null) as GradeComponent[];
    
    if (validUnits.length === 4) {
      const courseAverage = validUnits.reduce((acc, unit) => acc + calculateUnitGrade(unit), 0) / 4;
      totalSum += courseAverage;
      totalCount++;
    }
  });
  
  return totalCount > 0 ? Math.round((totalSum / totalCount) * 10) / 10 : null;
};

// Función para obtener el ranking de estudiantes por sección y grado
export const getStudentRanking = (studentId: string, gradeId: string, section: string): number | null => {
  const allStudents = getAllStudents();
  const classmatesStudents = allStudents.filter(s => s.gradeId === gradeId && s.section === section);
  
  const studentAverages = classmatesStudents.map(student => ({
    id: student.id,
    average: calculateStudentAverage(student.id, gradeId, section)
  })).filter(s => s.average !== null);
  
  studentAverages.sort((a, b) => (b.average || 0) - (a.average || 0));
  
  const rank = studentAverages.findIndex(s => s.id === studentId);
  
  return rank >= 0 ? rank + 1 : null;
};

// Función para obtener todos los estudiantes de una sección con sus promedios y rankings
export const getRankingBySection = (gradeId: string, section: string) => {
  const allStudents = getAllStudents();
  const classmatesStudents = allStudents.filter(s => s.gradeId === gradeId && s.section === section);
  
  const studentAverages = classmatesStudents.map(student => ({
    student,
    average: calculateStudentAverage(student.id, gradeId, section)
  })).filter(s => s.average !== null);
  
  studentAverages.sort((a, b) => (b.average || 0) - (a.average || 0));
  
  return studentAverages.map((item, index) => ({
    ranking: index + 1,
    student: item.student,
    average: item.average
  }));
};

// Datos de autenticación
export const authUsers = [
  { email: 'soporte@escuela.com', password: 'soporte123', role: 'support', id: 'support1', name: 'Soporte Técnico' },
  { email: 'admin1@escuela.com', password: 'admin1', role: 'admin', id: 'admin1', name: 'Administrador Principal' },
  
  // Docentes
  ...teachers.map(t => ({
    email: t.email,
    password: t.password,
    role: 'teacher',
    id: t.id,
    name: t.fullName
  })),
  
  // Estudiantes
  ...students.map(s => ({
    email: s.email,
    password: s.password,
    role: 'student',
    id: s.id,
    name: s.fullName
  }))
];