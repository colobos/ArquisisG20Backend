import express from 'express';
import { testFunction, dummyTestLock } from '../controllers/test.controller';

const router = express.Router();

router.get('/testRoute', testFunction);

router.get('/testLock', dummyTestLock);

export default router;