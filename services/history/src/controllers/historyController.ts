import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { History } from '../models/historyModel';

export const createHistory = async (req: Request, res: Response) => {
    try {
        const { userId, questionId } = req.body;
        if (!(userId && questionId)) {
            return res.status(400).json({ message: 'User ID or Question ID is missing' });
        } else if (!(isValidObjectId(userId) && isValidObjectId(questionId))) {
            return res.status(400).json({ message: 'User ID or Question ID is invalid' });
        }

        const history = await History.create({ userId, questionId });

        return res.status(201).json({ message: 'Created new history successfully', data: history });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when creating user history' });
    }
};

export const findHistoryByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'User ID is invalid' });
        }

        const questions = await History.find({ userId: userId }, { questionId: 1, date: 1 });
        return res.status(200).json({ message: 'Found history for user', data: questions });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when retrieving user history' });
    }
};
