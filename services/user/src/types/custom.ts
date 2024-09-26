import { Types } from 'mongoose';

export interface RequestUser {
    id: Types.ObjectId | string;
    username: string;
    password?: string;
    createdAt?: Date;
    email: string;
    isAdmin: boolean;
}
