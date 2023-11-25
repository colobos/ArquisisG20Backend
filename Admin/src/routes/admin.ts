import express from 'express';
import { purchaseToAdmin, getAdminActions, proposeExchange, createExchange, resultExchange,
         getExchangesPoposed, getExchangesOffersByOthers, purchaseHowAdmin, getMyExchangesOffers} from '../controllers/controller';

const router = express.Router();

router.post('/purchaseToAdmin', purchaseToAdmin);

router.post('/purchaseHowAdmin', purchaseHowAdmin);

router.post('/proposeExchange', proposeExchange);

router.post('/createExchange', createExchange);

router.post('/resultExchange', resultExchange);

router.get('/getAdminActions', getAdminActions);

router.get('/getExchangesPoposed/:auction_id', getExchangesPoposed);

router.get('/getExchangesOffersByOthers', getExchangesOffersByOthers);

router.get('/getMyExchangesOffers', getMyExchangesOffers);

export default router;