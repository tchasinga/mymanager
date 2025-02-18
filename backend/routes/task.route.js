import express from 'express';
import { createTaskManager, getUserTask } from '../controllers/task.controllers.js';

// initialize express router
const router = express.Router();

router.get('/getusertask', getUserTask)
router.post('/create', createTaskManager)