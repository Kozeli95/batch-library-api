import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/index';

const router: Express = express();

//logging
router.use(morgan('dev'));

//parse the request
router.use(express.urlencoded({ extended: false }));

//takes care of JSON data
router.use(express.json());

//rules of our api
router.use((req, res, next) => {
    //set CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    //set CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization')
    //set CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});

//routes
router.use('/', routes);

//error handling
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

//server
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));