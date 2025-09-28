import express from 'express';
import { calculate, getDashboardStats, getLatestAlerts, getLocationData, getRiskSummary } from '../controllers/calSystem.js';

const calSystemRouter = express.Router();

calSystemRouter.post('/', calculate);

calSystemRouter.get('/', getLocationData)

calSystemRouter.get('/alert', getLatestAlerts)

calSystemRouter.get('/status', getDashboardStats)

calSystemRouter.get('/count', getRiskSummary)


export default calSystemRouter;