import express from 'express';
import test from './test';
import admin from './admin';

const router = express.Router();

router.use('/test', test);

router.use('/admin', admin);

export default router;