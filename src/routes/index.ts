import express, { Request, Response, NextFunction } from "express";
import AuthController from "../controllers/AuthController";
import Root from "./Root";
import User from "./User";
import Auth from "./Auth";
import Verification from "./Verification";
import BankAccount from "./BankAccount";
import Card from "./Card";
import Loan from "./Loan";
import Transaction from "./Transaction";
import { NotFoundHandler } from "../../lib/src/middlewares";

const apiV1 = express.Router();

apiV1.use(Root);
apiV1.use("/users", Auth);
apiV1.use("/auth", Auth);
apiV1.use("/bank", BankAccount);
apiV1.use("/card", Card);
apiV1.use("/loan", Loan);
apiV1.use("/verify", Verification);
apiV1.use("/transaction", Transaction);
apiV1.use(NotFoundHandler);

export default apiV1;
