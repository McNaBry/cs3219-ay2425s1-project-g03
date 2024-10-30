import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';
import matchRequestRouter from './routes/matchRequestRoutes';
import bodyParser from 'body-parser';
import { verifyAccessToken } from './middleware/jwt';
import config from './config';

const app: Express = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    cors({
        origin: config.CORS_ORIGIN,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: ['Origin', 'X-Request-With', 'Content-Type', 'Accept', 'Authorization'],
    }),
);

// Routes
app.use('/', router);
app.use('/api/match/request', verifyAccessToken, matchRequestRouter);

export default app;
