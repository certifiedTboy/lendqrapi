import express, { Request, Response } from "express";
import { ResponseHandler } from "../../lib/src/helpers";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    return ResponseHandler.ok(res, { message: "Welcome to lendQr Api" });
});



export default router;
