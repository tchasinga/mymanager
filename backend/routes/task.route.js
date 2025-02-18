import express from 'express';
import { createTaskManager, deleteTask, getTaskById, getUserTask, updateTask,  } from '../controllers/task.controllers.js';

// initialize express router
const router = express.Router();

router.get('/getusertask/:id', getUserTask)
router.get('/taskbyid/:id', getTaskById)
router.post('/create', createTaskManager)
router.post('/update/:id', updateTask)
router.delete('/delete/:id', deleteTask)


// Export API routes
export default router;