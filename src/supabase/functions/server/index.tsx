import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Helper function to get user from access token
async function getUserFromToken(accessToken: string) {
  // Check if this is a predefined account token
  try {
    const decoded = JSON.parse(atob(accessToken));
    if (decoded.userId && decoded.userId.startsWith('predefined_')) {
      // Return user data for predefined account
      return {
        id: decoded.userId,
        email: decoded.email,
        user_metadata: { role: decoded.role }
      };
    }
  } catch (e) {
    // Not a predefined account token, continue with Supabase Auth
  }

  // Try Supabase Auth
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'apikey': SUPABASE_ANON_KEY
    }
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

// Predefined accounts
const PREDEFINED_ACCOUNTS = {
  student: { email: 'student1@escuela.com', password: 'student1', name: 'Estudiante Demo', role: 'student' },
  teacher: { email: 'docent1@escuela.com', password: 'docent1', name: 'Docente Demo', role: 'teacher' },
  admin: { email: 'admin1@escuela.com', password: 'admin1', name: 'Administrador Demo', role: 'admin' }
};

// Initialize predefined accounts and demo data
async function initializePredefinedAccounts() {
  try {
    console.log('Initializing predefined accounts...');
    
    const createdUserIds: Record<string, string> = {};
    
    for (const [key, account] of Object.entries(PREDEFINED_ACCOUNTS)) {
      const userId = `predefined_${key}`;
      
      // Check if user already exists in KV
      const existingUser = await kv.get(`user:${userId}`);
      
      if (!existingUser) {
        console.log(`Creating predefined account in KV: ${account.email}`);
        
        // Store in KV directly (no Supabase Auth needed)
        await kv.set(`user:${userId}`, {
          id: userId,
          email: account.email,
          name: account.name,
          role: account.role
        });
        createdUserIds[key] = userId;
        console.log(`Successfully created account: ${account.email}`);
      } else {
        console.log(`Account ${account.email} already exists in KV`);
        createdUserIds[key] = userId;
      }
    }

    // Create demo subjects and grades for student
    if (createdUserIds.student && createdUserIds.teacher) {
      await initializeDemoData(createdUserIds.student, createdUserIds.teacher);
    }
  } catch (error) {
    console.log('Error initializing predefined accounts:', error);
  }
}

// Initialize demo subjects and grades
async function initializeDemoData(studentId: string, teacherId: string) {
  try {
    console.log('Initializing demo data...');
    
    // Create demo subjects
    const subjects = [
      { name: 'Matemáticas', id: 'subject_math' },
      { name: 'Comunicación', id: 'subject_comm' },
      { name: 'Ciencia y Tecnología', id: 'subject_science' },
      { name: 'Ciencias Sociales', id: 'subject_social' }
    ];

    for (const subject of subjects) {
      const existingSubject = await kv.get(`subject:${subject.id}`);
      if (!existingSubject) {
        await kv.set(`subject:${subject.id}`, {
          id: subject.id,
          name: subject.name,
          teacherId: teacherId,
          teacherName: 'Docente Demo'
        });
        console.log(`Created subject: ${subject.name}`);
      }
    }

    // Create demo grades for student
    const bimesters = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4'];
    const baseGrades = [16, 15, 17, 18]; // Different grades for each bimester
    
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      for (let j = 0; j < bimesters.length; j++) {
        const bimester = bimesters[j];
        const gradeKey = `grade:${studentId}:${subject.id}:${bimester}`;
        const existingGrade = await kv.get(gradeKey);
        
        if (!existingGrade) {
          const grade = baseGrades[j] + (Math.random() > 0.5 ? 1 : -1);
          await kv.set(gradeKey, {
            studentId: studentId,
            studentName: 'Estudiante Demo',
            subjectId: subject.id,
            subjectName: subject.name,
            grade: grade,
            period: bimester,
            teacherId: teacherId,
            teacherName: 'Docente Demo',
            date: new Date().toISOString(),
            details: {
              procedural: grade + 1,
              attitudinal: grade,
              conceptual: grade - 1
            }
          });
          console.log(`Created grade for ${subject.name} - ${bimester}: ${grade}`);
        }
      }
    }
  } catch (error) {
    console.log('Error initializing demo data:', error);
  }
}

// Initialize on startup
initializePredefinedAccounts();

// Health check endpoint
app.get("/make-server-8107ac42/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize demo data endpoint
app.post("/make-server-8107ac42/init-demo", async (c) => {
  try {
    await initializePredefinedAccounts();
    return c.json({ success: true, message: "Demo data initialized" });
  } catch (error) {
    console.log('Error in init-demo:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-8107ac42/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    console.log('Signup attempt:', { email, name, role });
    
    if (!email || !password || !name || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    if (role !== 'teacher' && role !== 'student' && role !== 'admin') {
      return c.json({ error: "Invalid role. Must be 'teacher', 'student', or 'admin'" }, 400);
    }

    // Create user in Supabase Auth using REST API
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email,
        password,
        user_metadata: { name, role },
        email_confirm: true
      })
    });

    const responseText = await response.text();
    console.log('Signup raw response:', { ok: response.ok, status: response.status, body: responseText });

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('Failed to parse signup response as JSON:', responseText);
      return c.json({ error: 'Error del servidor al registrarse' }, 500);
    }

    if (!response.ok) {
      console.log(`Error creating user during signup: ${JSON.stringify(data)}`);
      const errorMsg = data.msg || data.message || data.error || 'Error al registrarse';
      return c.json({ error: errorMsg }, 400);
    }

    // Store user data in KV
    console.log('Storing user in KV with id:', data.id);
    await kv.set(`user:${data.id}`, {
      id: data.id,
      email,
      name,
      role
    });
    console.log('User stored successfully in KV');

    return c.json({ 
      success: true, 
      user: { 
        id: data.id, 
        email, 
        name, 
        role 
      } 
    });
  } catch (error) {
    console.log(`Error in signup endpoint: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-8107ac42/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, selectedRole } = body;
    
    console.log('=== SIGNIN REQUEST ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    console.log('Selected role:', selectedRole);
    
    if (!email || !password) {
      return c.json({ error: "Por favor ingrese correo y contraseña" }, 400);
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    // Get role names for error messages
    const roleNames = {
      admin: 'Administrativo',
      teacher: 'Docente',
      student: 'Estudiante'
    };
    
    // Check predefined accounts for this role
    const accountsForRole = Object.values(PREDEFINED_ACCOUNTS).filter(acc => 
      acc.role === selectedRole
    );
    
    console.log(`Looking for ${selectedRole} account with email: ${normalizedEmail}`);
    
    // Find matching email
    const predefinedAccount = Object.values(PREDEFINED_ACCOUNTS).find(acc => 
      acc.email.trim().toLowerCase() === normalizedEmail
    );
    
    // Email not found anywhere
    if (!predefinedAccount) {
      console.log('✗ Email not found in any account');
      return c.json({ 
        error: `El correo "${email}" no está registrado como ${roleNames[selectedRole as keyof typeof roleNames]}.`
      }, 404);
    }
    
    // Email found but wrong role
    if (predefinedAccount.role !== selectedRole) {
      console.log('✗ Email found but wrong role');
      const correctRoleName = roleNames[predefinedAccount.role as keyof typeof roleNames];
      return c.json({ 
        error: `Este correo pertenece a un usuario de tipo ${correctRoleName}, no ${roleNames[selectedRole as keyof typeof roleNames]}.`
      }, 403);
    }
    
    console.log('✓ Account found:', predefinedAccount.email);
    
    // Validate password
    if (password !== predefinedAccount.password) {
      console.log('✗ Password incorrect');
      return c.json({ 
        error: "La contraseña es incorrecta. Por favor verifique e intente nuevamente."
      }, 401);
    }
    
    console.log('✓ Password validated');
    
    // Create user object
    const userId = `predefined_${predefinedAccount.role}`;
    const user = {
      id: userId,
      email: predefinedAccount.email,
      name: predefinedAccount.name,
      role: predefinedAccount.role
    };
    
    // Save to KV
    try {
      await kv.set(`user:${userId}`, user);
      console.log('✓ User saved to KV');
    } catch (kvError) {
      console.log('Warning: Could not save to KV:', kvError);
    }
    
    // Generate token
    const token = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      timestamp: Date.now() 
    }));
    
    console.log('✓ Login successful');
    return c.json({ 
      access_token: token,
      user: user
    });
  } catch (error) {
    console.log(`Error in signin endpoint: ${error}`);
    return c.json({ error: "Error del servidor. Por favor intente nuevamente." }, 500);
  }
});

// Sign out endpoint
app.post("/make-server-8107ac42/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if this is a predefined account token
    try {
      const decoded = JSON.parse(atob(accessToken));
      if (decoded.userId && decoded.userId.startsWith('predefined_')) {
        // Just return success for predefined accounts (no actual logout needed)
        return c.json({ success: true });
      }
    } catch (e) {
      // Not a predefined account token, continue with Supabase Auth
    }

    // Sign out using Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      console.log(`Error signing out user: ${data.error || data.message}`);
      return c.json({ error: data.error || data.message || 'Error al cerrar sesión' }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error in signout endpoint: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get current user info
app.get("/make-server-8107ac42/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if this is a predefined account token
    try {
      const decoded = JSON.parse(atob(accessToken));
      if (decoded.userId && decoded.userId.startsWith('predefined_')) {
        // Get user from KV
        const userData = await kv.get(`user:${decoded.userId}`);
        if (userData) {
          return c.json({ user: userData });
        }
      }
    } catch (e) {
      // Not a predefined account token, continue with Supabase Auth
    }

    // Get user using Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });

    if (!response.ok) {
      console.log(`Error getting user: ${response.status}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await response.json();
    const userData = await kv.get(`user:${user.id}`);
    
    return c.json({ 
      user: userData || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role
      }
    });
  } catch (error) {
    console.log(`Error in user endpoint: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Create or update a grade (teachers only)
app.post("/make-server-8107ac42/grades", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const teacherData = await kv.get(`user:${user.id}`);
    if (!teacherData || teacherData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can create grades' }, 403);
    }

    const { studentId, studentName, subjectId, subjectName, grade, period } = await c.req.json();
    
    if (!studentId || !studentName || !subjectId || !subjectName || grade === undefined || !period) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const gradeData = {
      studentId,
      studentName,
      subjectId,
      subjectName,
      grade: Number(grade),
      period,
      teacherId: user.id,
      teacherName: teacherData.name,
      date: new Date().toISOString()
    };

    await kv.set(`grade:${studentId}:${subjectId}:${period}`, gradeData);

    return c.json({ success: true, grade: gradeData });
  } catch (error) {
    console.log(`Error creating grade: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get grades for a student
app.get("/make-server-8107ac42/grades/student/:studentId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const studentId = c.req.param('studentId');
    
    // Students can only see their own grades
    const userData = await kv.get(`user:${user.id}`);
    if (userData?.role === 'student' && user.id !== studentId) {
      return c.json({ error: 'You can only view your own grades' }, 403);
    }

    const grades = await kv.getByPrefix(`grade:${studentId}:`);
    
    return c.json({ grades: grades || [] });
  } catch (error) {
    console.log(`Error getting student grades: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all students (teachers and admins only)
app.get("/make-server-8107ac42/students", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || (userData.role !== 'teacher' && userData.role !== 'admin')) {
      return c.json({ error: 'Only teachers and admins can view all students' }, 403);
    }

    const users = await kv.getByPrefix('user:');
    const students = users.filter((u: any) => u.role === 'student');

    return c.json({ students });
  } catch (error) {
    console.log(`Error getting students: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all users (admins only)
app.get("/make-server-8107ac42/users/all", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || userData.role !== 'admin') {
      return c.json({ error: 'Only admins can view all users' }, 403);
    }

    const users = await kv.getByPrefix('user:');

    return c.json({ users });
  } catch (error) {
    console.log(`Error getting all users: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all grades (teachers and admins only)
app.get("/make-server-8107ac42/grades/all", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || (userData.role !== 'teacher' && userData.role !== 'admin')) {
      return c.json({ error: 'Only teachers and admins can view all grades' }, 403);
    }

    const grades = await kv.getByPrefix('grade:');

    return c.json({ grades: grades || [] });
  } catch (error) {
    console.log(`Error getting all grades: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Create a subject (teachers only)
app.post("/make-server-8107ac42/subjects", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const teacherData = await kv.get(`user:${user.id}`);
    if (!teacherData || teacherData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can create subjects' }, 403);
    }

    const { name } = await c.req.json();
    
    if (!name) {
      return c.json({ error: "Subject name is required" }, 400);
    }

    const subjectId = `subject_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subject = {
      id: subjectId,
      name,
      teacherId: user.id,
      teacherName: teacherData.name
    };

    await kv.set(`subject:${subjectId}`, subject);

    return c.json({ success: true, subject });
  } catch (error) {
    console.log(`Error creating subject: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all subjects
app.get("/make-server-8107ac42/subjects", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const subjects = await kv.getByPrefix('subject:');

    return c.json({ subjects: subjects || [] });
  } catch (error) {
    console.log(`Error getting subjects: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Debug endpoint to check all users (temporary)
app.get("/make-server-8107ac42/debug/users", async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    return c.json({ 
      count: users.length,
      users: users.map((u: any) => ({ id: u.id, email: u.email, role: u.role, name: u.name }))
    });
  } catch (error) {
    console.log(`Error getting debug users: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Debug endpoint to check predefined accounts
app.get("/make-server-8107ac42/debug/accounts", async (c) => {
  return c.json({ 
    accounts: Object.entries(PREDEFINED_ACCOUNTS).map(([key, acc]) => ({
      key,
      email: acc.email,
      password: acc.password,
      role: acc.role,
      name: acc.name
    }))
  });
});

Deno.serve(app.fetch);
