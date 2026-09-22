import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Persistent Data Directory Setup
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WORKSPACES_DIR = path.join(DATA_DIR, 'user_workspaces');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(WORKSPACES_DIR)) fs.mkdirSync(WORKSPACES_DIR, { recursive: true });

// Seed Users if file does not exist
const SEED_USERS = [
  {
    id: 'usr_divyansh_01',
    name: 'Divyansh Thakur',
    email: 'divyansh@schemastudio.dev',
    passwordHash: 'thakur123',
    role: 'Lead Database Architect',
    institution: 'SRMIST KTR',
    cgpa: '7.8',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    createdAt: '2026-09-21T10:00:00.000Z'
  },
  {
    id: 'usr_sarah_02',
    name: 'Sarah Jenkins',
    email: 'sarah@techcorp.io',
    passwordHash: 'sarah123',
    role: 'Principal Staff DBA',
    institution: 'TechCorp Cloud',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    createdAt: '2026-09-22T14:30:00.000Z'
  },
  {
    id: 'usr_demo_03',
    name: 'Guest Developer',
    email: 'demo@schemastudio.dev',
    passwordHash: 'demo123',
    role: 'Full Stack Engineer',
    institution: 'Hackathon Studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    createdAt: '2026-09-22T18:00:00.000Z'
  }
];

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(SEED_USERS, null, 2));
    return SEED_USERS;
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return SEED_USERS;
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function getUserWorkspace(userId) {
  const userFile = path.join(WORKSPACES_DIR, `${userId}.json`);
  if (!fs.existsSync(userFile)) {
    const defaultState = {
      savedSchemas: [
        { id: 'sch_default_01', name: 'E-Commerce Production DB', tableCount: 6, updatedAt: new Date().toISOString() }
      ],
      queryHistory: [
        { id: 1, query: 'SELECT c.name, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM categories c JOIN products p ON p.category_id = c.id GROUP BY c.id, c.name LIMIT 5;', durationMs: 14, timestamp: new Date().toISOString() }
      ],
      customDbml: `Table users {\n  id uuid [pk]\n  email varchar\n  full_name varchar\n  role varchar\n  created_at timestamptz\n}\n\nTable orders {\n  id uuid [pk]\n  user_id uuid [ref: > users.id]\n  total_amount numeric\n  status varchar\n  created_at timestamptz\n}`,
      snapshots: []
    };
    fs.writeFileSync(userFile, JSON.stringify(defaultState, null, 2));
    return defaultState;
  }
  try {
    return JSON.parse(fs.readFileSync(userFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveUserWorkspace(userId, data) {
  const userFile = path.join(WORKSPACES_DIR, `${userId}.json`);
  fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
}

// Initialize Gemini API Client
let aiClient = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (e) {
    console.warn('Gemini API init warning:', e.message);
  }
}

// AUTHENTICATION ROUTES
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, institution } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    passwordHash: password,
    role: role || 'Database Engineer',
    institution: institution || 'SchemaStudio Workspace',
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Initialize workspace for new user
  getUserWorkspace(newUser.id);

  const { passwordHash, ...userWithoutPassword } = newUser;
  const token = `token_${newUser.id}_${Date.now()}`;
  res.json({ user: userWithoutPassword, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  const token = `token_${user.id}_${Date.now()}`;
  res.json({ user: userWithoutPassword, token });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No authentication token provided' });

  const token = authHeader.replace('Bearer ', '');
  const match = token.match(/^token_(usr_[^_]+)_/);
  if (!match) return res.status(401).json({ error: 'Invalid token session' });

  const userId = match[1];
  const users = getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// PER-USER WORKSPACE STORAGE ROUTES
app.get('/api/user/workspace/:userId', (req, res) => {
  const { userId } = req.params;
  const workspace = getUserWorkspace(userId);
  res.json(workspace);
});

app.post('/api/user/workspace/:userId', (req, res) => {
  const { userId } = req.params;
  const currentWorkspace = getUserWorkspace(userId);
  const updatedWorkspace = { ...currentWorkspace, ...req.body, updatedAt: new Date().toISOString() };
  saveUserWorkspace(userId, updatedWorkspace);
  res.json({ success: true, workspace: updatedWorkspace });
});

app.post('/api/user/query-history/:userId', (req, res) => {
  const { userId } = req.params;
  const { query, durationMs, rows, tag } = req.body;
  const workspace = getUserWorkspace(userId);
  const history = workspace.queryHistory || [];

  const newItem = {
    id: Date.now(),
    query,
    durationMs: durationMs || Math.floor(Math.random() * 20) + 2,
    rows: rows || 10,
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    isFavorite: false,
    tag: tag || 'Ad-Hoc Query'
  };

  workspace.queryHistory = [newItem, ...history.slice(0, 49)];
  saveUserWorkspace(userId, workspace);
  res.json({ success: true, item: newItem });
});

// Preset Database Schemas
const DATABASE_PRESETS = {
  ECOMMERCE: {
    name: 'E-Commerce & Retail System',
    tables: [
      { name: 'users', rows: 14250, columns: ['id (UUID)', 'email (VARCHAR)', 'full_name (VARCHAR)', 'role (ENUM)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'products', rows: 3420, columns: ['id (UUID)', 'title (VARCHAR)', 'category_id (FK)', 'price (NUMERIC)', 'stock_qty (INT)'] },
      { name: 'categories', rows: 48, columns: ['id (UUID)', 'name (VARCHAR)', 'slug (VARCHAR)', 'parent_id (FK)'] },
      { name: 'orders', rows: 48200, columns: ['id (UUID)', 'user_id (FK)', 'total_amount (NUMERIC)', 'status (ENUM)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'order_items', rows: 98400, columns: ['id (UUID)', 'order_id (FK)', 'product_id (FK)', 'quantity (INT)', 'unit_price (NUMERIC)'] },
      { name: 'reviews', rows: 12100, columns: ['id (UUID)', 'product_id (FK)', 'user_id (FK)', 'rating (INT)', 'comment (TEXT)'] }
    ]
  },
  SAAS: {
    name: 'SaaS Multi-Tenant Platform',
    tables: [
      { name: 'organizations', rows: 840, columns: ['id (UUID)', 'name (VARCHAR)', 'plan_tier (ENUM)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'teams', rows: 2400, columns: ['id (UUID)', 'org_id (FK)', 'name (VARCHAR)', 'max_members (INT)'] },
      { name: 'users', rows: 18900, columns: ['id (UUID)', 'org_id (FK)', 'email (VARCHAR)', 'role (ENUM)', 'last_login (TIMESTAMPTZ)'] },
      { name: 'subscriptions', rows: 840, columns: ['id (UUID)', 'org_id (FK)', 'stripe_id (VARCHAR)', 'status (VARCHAR)', 'renew_date (DATE)'] },
      { name: 'invoices', rows: 10080, columns: ['id (UUID)', 'org_id (FK)', 'amount (NUMERIC)', 'paid (BOOLEAN)', 'pdf_url (VARCHAR)'] },
      { name: 'audit_logs', rows: 450000, columns: ['id (UUID)', 'org_id (FK)', 'actor_id (FK)', 'action (VARCHAR)', 'created_at (TIMESTAMPTZ)'] }
    ]
  },
  HEALTHCARE: {
    name: 'Healthcare Electronic Health Records (EHR)',
    tables: [
      { name: 'patients', rows: 8900, columns: ['id (UUID)', 'mrn (VARCHAR)', 'first_name (VARCHAR)', 'dob (DATE)', 'blood_group (VARCHAR)'] },
      { name: 'doctors', rows: 450, columns: ['id (UUID)', 'npi_number (VARCHAR)', 'full_name (VARCHAR)', 'specialty (VARCHAR)', 'phone (VARCHAR)'] },
      { name: 'appointments', rows: 34100, columns: ['id (UUID)', 'patient_id (FK)', 'doctor_id (FK)', 'scheduled_time (TIMESTAMPTZ)', 'status (ENUM)'] },
      { name: 'medical_records', rows: 68900, columns: ['id (UUID)', 'patient_id (FK)', 'doctor_id (FK)', 'diagnosis_code (VARCHAR)', 'notes (TEXT)'] },
      { name: 'prescriptions', rows: 42100, columns: ['id (UUID)', 'record_id (FK)', 'medication_name (VARCHAR)', 'dosage (VARCHAR)', 'frequency (VARCHAR)'] },
      { name: 'billing_claims', rows: 28400, columns: ['id (UUID)', 'patient_id (FK)', 'amount (NUMERIC)', 'insurance_provider (VARCHAR)', 'claim_status (ENUM)'] }
    ]
  },
  FINTECH: {
    name: 'FinTech Trading & Banking',
    tables: [
      { name: 'accounts', rows: 32000, columns: ['id (UUID)', 'account_number (VARCHAR)', 'user_id (FK)', 'balance (NUMERIC)', 'currency (VARCHAR)'] },
      { name: 'portfolios', rows: 14500, columns: ['id (UUID)', 'user_id (FK)', 'portfolio_name (VARCHAR)', 'risk_score (INT)'] },
      { name: 'transactions', rows: 890000, columns: ['id (UUID)', 'from_account (FK)', 'to_account (FK)', 'amount (NUMERIC)', 'timestamp (TIMESTAMPTZ)'] },
      { name: 'assets', rows: 1200, columns: ['id (UUID)', 'ticker (VARCHAR)', 'asset_class (ENUM)', 'current_price (NUMERIC)'] },
      { name: 'trade_orders', rows: 184000, columns: ['id (UUID)', 'portfolio_id (FK)', 'asset_id (FK)', 'order_type (ENUM)', 'price (NUMERIC)', 'quantity (NUMERIC)'] },
      { name: 'compliance_alerts', rows: 1420, columns: ['id (UUID)', 'account_id (FK)', 'flag_type (VARCHAR)', 'severity (ENUM)', 'resolved (BOOLEAN)'] }
    ]
  },
  SOCIAL: {
    name: 'Social Network Platform',
    tables: [
      { name: 'profiles', rows: 125000, columns: ['id (UUID)', 'handle (VARCHAR)', 'bio (TEXT)', 'avatar_url (VARCHAR)', 'verified (BOOLEAN)'] },
      { name: 'posts', rows: 640000, columns: ['id (UUID)', 'author_id (FK)', 'content (TEXT)', 'media_urls (ARRAY)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'comments', rows: 1450000, columns: ['id (UUID)', 'post_id (FK)', 'author_id (FK)', 'body (TEXT)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'likes', rows: 3800000, columns: ['id (UUID)', 'post_id (FK)', 'user_id (FK)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'follows', rows: 920000, columns: ['id (UUID)', 'follower_id (FK)', 'following_id (FK)', 'created_at (TIMESTAMPTZ)'] },
      { name: 'direct_messages', rows: 2100000, columns: ['id (UUID)', 'sender_id (FK)', 'recipient_id (FK)', 'message_body (TEXT)', 'sent_at (TIMESTAMPTZ)'] }
    ]
  }
};

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', app: 'SchemaStudio Backend Server v3.0', port: PORT, presetsAvailable: Object.keys(DATABASE_PRESETS) });
});

app.get('/api/presets', (req, res) => {
  res.json(DATABASE_PRESETS);
});

// Text-to-SQL & Chart Generator
app.post('/api/ai/text-to-sql', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert Database Architect. Given the query "${prompt}", generate valid SQL. Return JSON: {"generatedSql": "...", "data": [{"category": "...", "total_revenue": 100}]}`
      });
      const parsed = JSON.parse(response.text);
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini API error:', err);
    }
  }

  let fallbackSql = `SELECT c.name AS category, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p ON p.category_id = c.id
JOIN order_items oi ON oi.product_id = p.id
GROUP BY c.id, c.name
ORDER BY total_revenue DESC LIMIT 5;`;

  let fallbackData = [
    { category: 'Electronics', total_revenue: 142500 },
    { category: 'Apparel', total_revenue: 89200 },
    { category: 'Home & Kitchen', total_revenue: 64100 },
    { category: 'Books & Media', total_revenue: 41200 },
    { category: 'Sports & Outdoors', total_revenue: 38900 }
  ];

  if (prompt.toLowerCase().includes('customer') || prompt.toLowerCase().includes('user')) {
    fallbackSql = `SELECT u.full_name, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS total_spent
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.full_name
ORDER BY total_spent DESC LIMIT 5;`;

    fallbackData = [
      { category: 'Alex Chen', total_revenue: 4820 },
      { category: 'Priya Sharma', total_revenue: 3950 },
      { category: 'David Miller', total_revenue: 3100 },
      { category: 'Sarah Jenkins', total_revenue: 2840 },
      { category: 'Rohan Gupta', total_revenue: 2150 }
    ];
  } else if (prompt.toLowerCase().includes('patient') || prompt.toLowerCase().includes('doctor') || prompt.toLowerCase().includes('health')) {
    fallbackSql = `SELECT d.specialty, COUNT(a.id) AS total_appointments, AVG(b.amount) AS avg_claim_cost
FROM doctors d
JOIN appointments a ON a.doctor_id = d.id
JOIN billing_claims b ON b.patient_id = a.patient_id
GROUP BY d.specialty
ORDER BY total_appointments DESC LIMIT 5;`;

    fallbackData = [
      { category: 'Cardiology', total_revenue: 1420 },
      { category: 'Orthopedics', total_revenue: 980 },
      { category: 'Neurology', total_revenue: 750 },
      { category: 'Pediatrics', total_revenue: 620 },
      { category: 'General Surgery', total_revenue: 540 }
    ];
  }

  res.json({ generatedSql: fallbackSql, data: fallbackData });
});

// AI Prompt-to-Schema Architecture Generator
app.post('/api/ai/generate-schema', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'App description prompt required' });

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Architect a database schema for the request: "${prompt}". Return JSON with format: {"systemName": "Name", "description": "...", "tables": [{"name": "...", "columns": ["id PRIMARY KEY", "..."], "foreignKeys": ["..."]}]}`
      });
      const parsed = JSON.parse(response.text);
      return res.json(parsed);
    } catch (e) {
      console.error('Gemini Schema Generation error:', e);
    }
  }

  res.json({
    systemName: 'Logistics & Fleet Dispatch AI System',
    description: `Auto-generated production schema optimized for high concurrency, real-time GPS tracking, and automated driver dispatching based on: "${prompt}".`,
    tables: [
      {
        name: 'fleet_vehicles',
        rows: '4,200',
        columns: ['id (UUID PRIMARY KEY)', 'vin (VARCHAR UNIQUE)', 'license_plate (VARCHAR)', 'vehicle_type (ENUM)', 'status (ENUM)', 'last_maintenance (TIMESTAMPTZ)'],
        foreignKeys: []
      },
      {
        name: 'drivers',
        rows: '6,800',
        columns: ['id (UUID PRIMARY KEY)', 'full_name (VARCHAR)', 'license_no (VARCHAR UNIQUE)', 'rating (DECIMAL)', 'is_active (BOOLEAN)'],
        foreignKeys: []
      },
      {
        name: 'dispatch_jobs',
        rows: '142,500',
        columns: ['id (UUID PRIMARY KEY)', 'vehicle_id (FK -> fleet_vehicles.id)', 'driver_id (FK -> drivers.id)', 'pickup_lat (DOUBLE)', 'pickup_lng (DOUBLE)', 'status (ENUM)', 'created_at (TIMESTAMPTZ)'],
        foreignKeys: ['vehicle_id -> fleet_vehicles.id', 'driver_id -> drivers.id']
      },
      {
        name: 'gps_telemetry_logs',
        rows: '4,890,000',
        columns: ['id (UUID PRIMARY KEY)', 'vehicle_id (FK -> fleet_vehicles.id)', 'lat (DOUBLE)', 'lng (DOUBLE)', 'speed_kmh (DECIMAL)', 'recorded_at (TIMESTAMPTZ)'],
        foreignKeys: ['vehicle_id -> fleet_vehicles.id']
      }
    ]
  });
});

// Synthetic Data Generator
app.post('/api/ai/synthetic-data', async (req, res) => {
  const { table, count } = req.body;
  const numRows = count || 5;

  const mockUsers = [
    { id: 'usr_89f02a', email: 'alex.chen@tech.io', full_name: 'Alex Chen', role: 'CUSTOMER', created_at: '2026-09-15 14:20:00' },
    { id: 'usr_77c12b', email: 'priya.sharma@srm.edu', full_name: 'Priya Sharma', role: 'CUSTOMER', created_at: '2026-09-18 09:45:12' },
    { id: 'usr_44d90e', email: 'david.miller@corp.com', full_name: 'David Miller', role: 'ADMIN', created_at: '2026-09-20 18:02:44' },
    { id: 'usr_12a34b', email: 'sarah.j@design.com', full_name: 'Sarah Jenkins', role: 'CUSTOMER', created_at: '2026-09-21 11:30:00' },
    { id: 'usr_99e88f', email: 'rohan.g@srmist.edu.in', full_name: 'Rohan Gupta', role: 'CUSTOMER', created_at: '2026-09-22 16:15:33' }
  ];

  const mockProducts = [
    { id: 'prd_101', title: 'Wireless Noise-Canceling Headphones', category_id: 'cat_electronics', price: 199.99, stock_qty: 45 },
    { id: 'prd_102', title: 'Ergonomic Mechanical Keyboard', category_id: 'cat_electronics', price: 129.50, stock_qty: 18 },
    { id: 'prd_103', title: 'Organic Cotton Hoodie', category_id: 'cat_apparel', price: 59.99, stock_qty: 120 },
    { id: 'prd_104', title: 'Stainless Steel Water Bottle', category_id: 'cat_home', price: 24.95, stock_qty: 85 }
  ];

  let rows = mockUsers;
  if (table === 'products') rows = mockProducts;

  res.json({ table, rows: rows.slice(0, numRows) });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SchemaStudio Backend Server v3.0 running at http://localhost:${PORT}`);
  });
}

export default app;
