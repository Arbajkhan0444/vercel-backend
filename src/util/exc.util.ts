import { NextFunction, Request, Response } from "express"

const Exc = (fn: any)=>(req: Request, res: Response, next: NextFunction)=>{
    Promise.resolve(fn(req, res, next)).catch((err: any)=>{
        res.status(500).json({
            message: process.env.NODE_ENV === "dev" ? err.message : "failed ! please try after sometime"
        })
    })
}

export default Exc