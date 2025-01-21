import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { jwk } from "../lib/jwt.config.js";


export default async function authMiddleware(req:Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization']
    const jwt: string = authorization?.split(" ")[1] || ""

    const { payload, protectedHeader } = await jwtVerify(jwt, jwk)

    if (payload) {
        req.userId = payload.id as string
        next()
    }else{
        console.log("error in middleware")
        res.status(400).json({
            msg: "authorization required"
        })
    }
    
}