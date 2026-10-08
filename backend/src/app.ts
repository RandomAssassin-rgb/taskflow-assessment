import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import dashboardRoutes from './routes/dashboard';
import prisma from './db/client';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    const userCount = await prisma.user.count();
    res.status(200).json({
      status: 'ok',
      service: 'taskflow-backend',
      database: 'connected',
      userTable: 'ready',
      userCount
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      service: 'taskflow-backend',
      database: 'disconnected',
      message: error?.message || 'Database connection failed'
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
