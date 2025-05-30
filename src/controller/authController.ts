import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createAuthService, loginAuthService } from '../services/authService';
import { TIUserWithCustomer } from '../types';
import jwt from 'jsonwebtoken';

export const creatUserController = async (req: Request, res: Response) => {
    try {
        const userData: TIUserWithCustomer = req.body;
        const password = userData.password;
        userData.password = await bcrypt.hashSync(password, 10);
        userData.role = userData.role || 'customer'; // Default role is customer
        const createUser = await createAuthService(userData);
         if (!createUser) {
            res.status(400).json({ message: "User creation failed" });
            return 
        }
        res.status(201).json({ message: "User created successfully", user: createUser });

        
        
    } catch (error) {
        console.error("Error in createUserController:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
    
}

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const existingUser = await loginAuthService(user);
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userMatch = await bcrypt.compareSync(user.password, existingUser.password);
        if (!userMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
         const payload ={
        sub: existingUser.user_id,
        user_id: existingUser.user_id,
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        role:existingUser.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
        
    }
        // Here you would typically generate a JWT token using a library like jsonwebtoken
        const secret =process.env.JWT as string;
        if (!secret) {

            throw new Error("JWT secret is not defined");
        }
        const token = jwt.sign(payload, secret);
        console.log({token});
        return res.status(200).json(
            { 
                message: "Login successful", 
                
                user: {
                    id: existingUser.user_id,
                    first_name: existingUser.first_name,
                    last_name: existingUser.last_name,
                    email: existingUser.email
                }, 
                token 



            });

        
    } catch (error) {
        console.error("Error in loginUserController:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

    
}