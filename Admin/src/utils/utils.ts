const { Stock, Auction } = require("../../db/models");
const Sequelize = require("sequelize");
import { auction } from "./interfaces";

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function verifyIfAdminHaveEnoughAction (actionName: string, amount: number) {
    const amountAviable: number = await Stock.findOne({
        where: {
            name: actionName
        }
    }).then( (data: any) => {
        if (data) {
            return data.dataValues.amount
        } else {
            throw new Error('No se encontraron acciones de esta empresa');
        }

    });

    if (amountAviable >= amount) {
        return true
    } else {
        return false
    }
}

export async function decreseActions (actionName: string, amount: number) {
    await Stock.decrement(
        'amount',
        {
        by: amount,
        where: {
            name: actionName
        }
    });
}

export async function incrementActions (actionName: string, amount: number) {
    await Stock.increment(
        'amount',
        {
        by: amount,
        where: {
            name: actionName
        }
    });
}

export async function getActionsValues () {
    const allActions: any = await Stock.findAll();
    
    const infoMapped : {name: string, amount: number, price: number}[] = allActions.map(
        (item : any) => {
            return {
                "name":item.dataValues.name,
                "amount":item.dataValues.amount,
                "price":item.dataValues.price
            };
        }
    )

    return infoMapped;
}

export async function getOffers (isOurGroup: boolean) {
    const allActions: any = await Auction.findAll({
        where: { 
            group_id: isOurGroup ? 20 : { [Sequelize.Op.ne]: 20 },
            type: 'offer'
        }
    });
    
    const infoMapped : auction[] = allActions.map(
        (item : any) => {
            return item.dataValues
        }
    )

    return infoMapped;
}

export async function getExchangesOfOneOffer ( auction_id: string ) {
    const allActions: any = await Auction.findAll({
        where: {
            auction_id: auction_id,
            type: 'proposal'
        }
    });
    
    const infoMapped : auction[] = allActions.map(
        (item : any) => {
            return item.dataValues
        }
    )

    return infoMapped;
}

export async function getOneExchange (auction_id: string, proposal_id: string) {
    const exchange : auction = await Auction.findOne({
        where: {
            auction_id: auction_id,
            proposal_id: proposal_id
        }
    }).then( (data: any) => {
        if (data) {
            return data.dataValues
        } else {
            throw new Error('No se encontro esta transacción');
        }

    });;

    return exchange;
}

export async function  tryAcceptPropose (data: auction) {
    try {
        const proposeIsPosible: boolean = await verifyIfAdminHaveEnoughAction(data.stock_id, data.quantity);

        if (proposeIsPosible) {

            const offer : auction = await getOneExchange(data.auction_id, "");

            await decreseActions(offer.stock_id, offer.quantity);

            const proposal : auction = await getOneExchange(data.auction_id, data .proposal_id);

            await incrementActions(proposal.stock_id, proposal.quantity);
            
            await updateOffer( proposal.proposal_id, 'acceptance' )
            return true;
        } else {
            return false;
        }
    }  catch (error: any){
        return false;
    }  
}

export async function  tryRejectPropose (data: auction) {
    try {
            
        await updateOffer( data.proposal_id, 'rejection');
        return true;

    }  catch (error: any){
        return false;
    }  
}

export async function updateOffer (proposal_id: string, result: string) {
    await Auction.update(
        {
            type: result
        },
        {
        where: {
            proposal_id: proposal_id
        }
    });
}

export async function createOfferExchange (data: auction) {
    await Auction.create(data);
}