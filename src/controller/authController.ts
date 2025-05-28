import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import { createAuthService, loginAuthService } from '../services/authService';


export const creatUserController = async (req:Request,res:Response) => {
    try {
        const user = req.body;
        const password= user.password;
        const hashedPassword = await bcrypt.hashSync(password, 10);
         user.password = hashedPassword;
         const createUser = await createAuthService(user);
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

export const loginUserController = async (req:Request,res:Response) => {
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
        res.status(200).json({ message: "Login successful", user: existingUser });
    } catch (error) {
        console.error("Error in loginUserController:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

    
}