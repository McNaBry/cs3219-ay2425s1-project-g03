import { model, Schema, Types } from 'mongoose';

export interface IHistory {
    userId: Types.ObjectId;
    questionId: Types.ObjectId;
    date: Date;
}

const historySchema = new Schema<IHistory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        questionId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    { versionKey: false },
);

export const History = model<IHistory>('History', historySchema);
