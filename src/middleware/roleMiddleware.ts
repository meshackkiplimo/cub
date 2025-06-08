import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
    role: string;
    user_id: string;
    // Add other JWT payload fields as needed
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            res.status(401).json({ message: 'anauthorized' });
            return;
        }

        const secret = process.env.JWT as string;
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }

        const decoded = jwt.verify(token, secret) as JWTPayload;
        
        if (decoded.role !== 'admin') {
            res.status(403).json({ 
                message: 'Access denied. Admin role required.' 
            });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'anauthorized' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Helper middleware for checking specific roles
export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                res.status(401).json({ message: 'No token provided' });
                return;
            }

            const secret = process.env.JWT as string;
            if (!secret) {
                throw new Error('JWT secret is not defined');
            }

            const decoded = jwt.verify(token, secret) as JWTPayload;
            
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ 
                    message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
                });
                return;
            }

            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

// Middleware to check if the user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const secret = process.env.JWT as string;
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }

        const decoded = jwt.verify(token, secret) as JWTPayload;
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}
