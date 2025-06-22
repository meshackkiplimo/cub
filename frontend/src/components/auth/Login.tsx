import React, { useState } from 'react'
import * as yup from 'yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginAPI } from '../../Features/users/logiApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Features/login/userSlice';
import Spinner from '../spinner/Spinner';


type UserInputs = {
    email: string;
    password: string;
}
const schema = {
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
};


const Login = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] =useState(false);
    const emailFromState = location.state?.email || '';
    const dispatch = useDispatch() // Assuming you have a dispatch function in state
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserInputs>({
        resolver: yupResolver(yup.object().shape(schema))
    });

    const [loginUser] = loginAPI.useLoginUserMutation();

   const onSubmit:SubmitHandler<UserInputs> = async(data) => {
    setIsLoading(true);
    try {

        const response = await loginUser(data).unwrap();
        dispatch(loginSuccess(response))
        console.log("Login successful:", response);

        // if user is not verified give and error

        setTimeout(()=>{
            navigate('/')

        }, 2000);

        
    } catch (error) {
        console.error("Error during login:", error);
        // Handle error appropriately, e.g., show a toast notification
        // toast.error("Login failed. Please check your credentials and try again.");
        
    }
    setIsLoading(true);
    
   }

    

  return (
    <div>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                 // Make input read-only if email is provided from state
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
    
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
    
                <div>
                    {
                        isLoading ?(
                            <Spinner/>

                        ):(

              
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-400 hover:bg-green-800 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign In
                </button>
                          )
                    }
                <div>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account? <a href="/signup" className="text-indigo-600 hover:text-indigo-500">Register</a>
                    </p>
                </div>
                </div>
            </form>
            </div>
        </div>
      
    </div>
  )
}


export default Login
