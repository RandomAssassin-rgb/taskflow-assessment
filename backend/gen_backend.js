const fs = require('fs');
const path = require('path');

const files = {
  'src/middleware/auth.ts': `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};`,
  'src/routes/auth.ts': `import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password_hash, full_name }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, email, full_name } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, email, full_name: user.full_name } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, email: true, full_name: true } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;`,
  'src/routes/projects.ts': `import { Router } from 'express';
import prisma from '../db/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: any, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { owner_id: req.user.userId },
      include: {
        _count: { select: { tasks: true } },
        tasks: { where: { status: 'COMPLETED' }, select: { id: true } }
      }
    });
    
    const mapped = projects.map(p => ({
      ...p,
      progress: p._count.tasks > 0 ? (p.tasks.length / p._count.tasks) * 100 : 0
    }));
    res.json({ success: true, data: mapped });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req: any, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, owner_id: req.user.userId },
      include: { tasks: true }
    });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        ...req.body,
        owner_id: req.user.userId
      }
    });
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req: any, res) => {
  try {
    const project = await prisma.project.updateMany({
      where: { id: req.params.id, owner_id: req.user.userId },
      data: req.body
    });
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    // Also delete tasks
    await prisma.task.deleteMany({ where: { project: { id: req.params.id, owner_id: req.user.userId } } });
    await prisma.project.deleteMany({
      where: { id: req.params.id, owner_id: req.user.userId }
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;`,
  'src/routes/tasks.ts': `import { Router } from 'express';
import prisma from '../db/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: any, res) => {
  try {
    const { status, priority, search } = req.query;
    const where: any = { project: { owner_id: req.user.userId } };
    if (status && status !== 'All') where.status = status;
    if (priority && priority !== 'All') where.priority = priority;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    
    const tasks = await prisma.task.findMany({ where, include: { project: true } });
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const task = await prisma.task.create({
      data: req.body
    });
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req: any, res) => {
  try {
    // ensure owns
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, project: { owner_id: req.user.userId } } });
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, project: { owner_id: req.user.userId } } });
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;`,
  'src/routes/dashboard.ts': `import { Router } from 'express';
import prisma from '../db/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: any, res) => {
  try {
    const projects = await prisma.project.count({ where: { owner_id: req.user.userId } });
    const inProgressProjects = await prisma.project.count({ where: { owner_id: req.user.userId, status: 'IN_PROGRESS' } });
    const totalTasks = await prisma.task.count({ where: { project: { owner_id: req.user.userId } } });
    const completedTasks = await prisma.task.count({ where: { project: { owner_id: req.user.userId }, status: 'COMPLETED' } });
    const pendingTasks = await prisma.task.count({ where: { project: { owner_id: req.user.userId }, status: 'PENDING' } });
    
    res.json({
      success: true,
      data: {
        totalProjects: projects,
        projectsInProgress: inProgressProjects,
        totalTasks,
        completedTasks,
        pendingTasks
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(process.cwd(), filepath), content);
}
console.log("Files generated");
