import { Difficulty } from '../models/matchRequestModel';
import { MatchUpdatedEvent, MatchFoundEvent } from '../types/event';
import messageBroker from './broker';
import { Queues } from './queues';

export async function produceMatchUpdatedRequest(
    requestId: string,
    userId: string,
    username: string,
    topics: string[],
    difficulty: Difficulty,
) {
    const message: MatchUpdatedEvent = {
        user: { id: userId, username, requestId },
        topics,
        difficulty,
    };
    await messageBroker.produce(Queues.MATCH_REQUEST_UPDATED, message);
}

export async function produceMatchFound(user1: any, user2: any, topics: string[], difficulty: Difficulty) {
    const message: MatchFoundEvent = { user1, user2, topics, difficulty };
    await messageBroker.produce(Queues.MATCH_FOUND, message);
}
