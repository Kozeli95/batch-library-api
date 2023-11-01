"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const router = (0, express_1.default)();
//logging
router.use((0, morgan_1.default)('dev'));
//parse the request
router.use(express_1.default.urlencoded({ extended: false }));
//takes care of JSON data
router.use(express_1.default.json());
//rules of our api
router.use((req, res, next) => {
    //set CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    //set CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    //set CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});
//routes
router.use('/', index_1.default);
//error handling
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
//server
const httpServer = http_1.default.createServer(router);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
