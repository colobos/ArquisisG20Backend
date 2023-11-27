import { Request, Response, NextFunction } from 'express';
import axios, { Axios, AxiosResponse } from 'axios';
import { sleep } from '../utils/utils';
import asyncLock from 'async-lock';

const lock = new asyncLock();

export const testFunction = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`);
    return res.send(result.data);
}

export const dummyTestLock = async (req: Request, res: Response) => {
    try {
        await lock.acquire('resourceLock', async () => {

            let letter: string = req.query.letter as string?? 'A';
            let iterations: number = parseInt(req.query.counter as string?? '5');
            for (let count = 1; count <= iterations; count++) {
                console.log(`El dummy con la letra ${letter} va en ${count}`)
                await sleep(1000)
            }
            return res.send('El dummy fue activado :o');
        });
    } catch (error: any) {
        res.status(500).send('Failed to access the resource.');
    }
    
}
