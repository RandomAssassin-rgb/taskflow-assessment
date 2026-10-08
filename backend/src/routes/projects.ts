import { Router } from 'express';
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
    
    await prisma.task.deleteMany({ where: { project: { id: req.params.id, owner_id: req.user.userId } } });
    await prisma.project.deleteMany({
      where: { id: req.params.id, owner_id: req.user.userId }
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;