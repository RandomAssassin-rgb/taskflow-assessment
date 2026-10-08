import { Router } from 'express';
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

export default router;