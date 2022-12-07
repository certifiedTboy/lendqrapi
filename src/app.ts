import express, { Express, Request, Response } from 'express';
const app: Express = express();
import apiV1 from './routes/index';
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"
import cookieParser from "cookie-parser";
import * as path from "path";
import { GlobalErrorHandler } from '../lib/src/middlewares';





const allowedOrigins = ['http://localhost:3000'];
const expressOptions = {
  urlencodExtended : true,
  requestSizeLimit : "20mb",
}
const corsOption = {
  allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'X-Auth-Token',
      'Authorization',
      'Accept-Encoding',
      'Connection',
      'Content-Length'
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: allowedOrigins,
  preflightContinue: false,
}


app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cookieParser());
app.use(morgan("combined"))
app.use(cors(corsOption));
app.use(express.json({ limit: expressOptions.requestSizeLimit }));
app.use(express.urlencoded({ limit: expressOptions.requestSizeLimit, extended: expressOptions.urlencodExtended }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use("/api/v1", apiV1)
app.use(GlobalErrorHandler)








export default app