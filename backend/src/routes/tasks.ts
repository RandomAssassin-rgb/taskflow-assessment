import { Router } from 'express';
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

router.get('/:id', async (req: any, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, project: { owner_id: req.user.userId } },
      include: { project: true }
    });
    if (!task) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req: any, res) => {
  try {
    
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

export default router;