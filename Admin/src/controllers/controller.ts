import { Request, Response, NextFunction } from 'express';
import axios, { Axios, AxiosResponse } from 'axios';
import { verifyIfAdminHaveEnoughAction, decreseActions, getActionsValues, getExchangesOfOneOffer, tryAcceptPropose,
         incrementActions, tryRejectPropose, createOfferExchange, getOffers } from '../utils/utils';
import asyncLock from 'async-lock';
const { Stock, Auction } = require("../../db/models");
import { auction } from '../utils/interfaces';

const lock = new asyncLock();

interface AuctionData {
    auction_id: string;
    proposal_id: string;
    stock_id: string;
    quantity: number;
    group_id: number;
    type: string;
  }


export async function purchaseToAdmin (req: Request, res: Response, next: NextFunction){
    try {
        await lock.acquire('resourceLock', async () => {
            let actionName = req.body.actionName;
            let amount = req.body.amount;

            const purchaseIsPosible: boolean = await verifyIfAdminHaveEnoughAction(actionName, amount);
            
            if (purchaseIsPosible) {
                await decreseActions(actionName, amount);

                return res.send('Transacción realizada correctamente');
            } else {
                return res.status(400).send('No hay suficientes acciones disponibles');
            }

        });
    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function purchaseHowAdmin (req: Request, res: Response, next: NextFunction){
    try {
        await lock.acquire('resourceLock', async () => {
            let actionName = req.body.actionName;
            let amount = req.body.amount;

            await incrementActions(actionName, amount);

            return res.send('Acciones compradas correctamente');
        });
    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function getAdminActions (req: Request, res: Response, next: NextFunction){
    try {
        const data : {name: string, amount: number, price: number}[] = await getActionsValues();

        res.send(data);
    } catch (error: any) {
        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
    
}

export async function proposeExchange (req: Request, res: Response, next: NextFunction){
    try {

        const proposeIsPosible: boolean = await verifyIfAdminHaveEnoughAction(req.body.stock_id, req.body.quantity);

        if (proposeIsPosible) {
            const propose = {
                "auction_id": req.body.auction_id,
                "proposal_id": req.body.proposal_id,
                "stock_id": req.body.stock_id,
                "quantity": req.body.quantity,
                "group_id": req.body.group_id,
                "type": "proposal"
            }
        
            // const responseMqtt: AxiosResponse = await axios.post(
            //     'http://app_listener:8000/auctions' , 
            //     propose
            // );
            
            console.log( propose );

            res.send('Propuesta enviada correctamente');

        } else {
            return res.status(400).send('No hay suficientes acciones disponibles');
        }
        

    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function resultExchange (req: Request, res: Response, next: NextFunction){
    try {

        let resultIsWorked : boolean = false;

        if (req.body.type == "acceptance") {
            resultIsWorked = await tryAcceptPropose(req.body);
        } else if (req.body.type == "rejection") {
            resultIsWorked = await tryRejectPropose(req.body);
        } 

        if (resultIsWorked) {
            
            const result = {
            "auction_id": req.body.auction_id,
            "proposal_id": req.body.proposal_id,
            "stock_id": req.body.stock_id,
            "quantity": req.body.quantity,
            "group_id": req.body.group_id,
            "type": req.body.type
            }
        
            // const responseMqtt: AxiosResponse = await axios.post(
            //     'http://app_listener:8000/auctions' , 
            //     result
            // );
            
            console.log( result );

            res.send(`Propuesta ${req.body.type} correctamente`);
            
        } else {
            return res.status(400).send('Something is wrong');
        }
        
    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function createExchange (req: Request, res: Response, next: NextFunction){
    try {

        const proposeIsPosible: boolean = await verifyIfAdminHaveEnoughAction(req.body.stock_id, req.body.quantity);

        if (proposeIsPosible) {
            const propose = {
                "auction_id": req.body.auction_id,
                "proposal_id": "",
                "stock_id": req.body.stock_id,
                "quantity": req.body.quantity,
                "group_id": req.body.group_id,
                "type": "offer"
            }
        
            // const responseMqtt: AxiosResponse = await axios.post(
            //     'http://app_listener:8000/auctions' , 
            //     propose
            // );
            
            console.log( propose );

            await createOfferExchange( propose );

            res.send('Propuesta creada correctamente');

        } else {
            return res.status(400).send('No hay suficientes acciones disponibles');
        }
        

    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function getExchangesOffersByOthers (req: Request, res: Response, next: NextFunction){
    try {
    
        const exchangesAviables : auction[] = await getOffers( false ); 
    
        res.send(exchangesAviables);

    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function getMyExchangesOffers (req: Request, res: Response, next: NextFunction){
    try {
    
        const exchangesAviables : auction[] = await getOffers( true ); 
    
        res.send(exchangesAviables);

    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}

export async function getExchangesPoposed (req: Request, res: Response, next: NextFunction){
    try {
        let auction_id: string = req.params.auction_id;

        const exchangesAviables : auction[] = await getExchangesOfOneOffer( auction_id ); 
    
        res.send(exchangesAviables);

    } catch (error: any) {

        const msg: string = error.message?? 'Something is wrong'; 

        res.status(500).send(msg);
    }
}



export async function createProposal(req: Request, res: Response) {
    try {
      console.log('Datos recibidos:', req.body);
      console.log("vaaaar 1");
      console.log("vaaaar 1");
      console.log("vaaaar 1");
      console.log("vaaaar 1");
      console.log("vaaaar 1");
      console.log("vaaaar 1");
      console.log("vaaaar 1");
      console.log("vaaaar 1");
  
      const requestData: any = req.body.formattedData; 

      const customerPurchase = await Auction.create(requestData);
  
      res.status(200).json({ message: 'Datos recibidos exitosamente' });
    } catch (error) {
      console.error('Error en la ruta POST:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }