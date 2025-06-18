import { NextFunction } from "express";
import { Rate } from "k6/metrics";
import { Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";



const rateLimiter = new RateLimiterMemory({
    points:10,
    duration:60
})

export const rateLimit = async (req:Request, res:Response, next:NextFunction) => {

    try {
        await rateLimiter.consume(req.ip || "unknown"); // Consume a point for the request based on the client's IP address
        console.log(`Rate limit check passed for IP: ${req.ip}`);
        next(); // Proceed to the next middleware or route handler
        
    } catch (error) {
        res.status(429).json({ message: "Too many requests, please try again later." });
        return;
        
    }
}

