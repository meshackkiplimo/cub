import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { UserApi } from '../../Features/users/userApi';
import { toast, Toaster } from 'sonner';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import { useToast } from '../toaster/ToasterContext';

type UserInputs = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const schema = yup.object({
   first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})
const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {showToast} = useToast()
  
  const [createUser] = UserApi.useCreateUsersMutation();
 
  const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserInputs>({
        resolver: yupResolver(schema),
    });

  const onSubmit: SubmitHandler<UserInputs> =async  (data) => {
  setIsLoading(true);
    console.log(data);
  try {
    const response = await createUser(data).unwrap();
    showToast("Registration successful! Please check your email to verify your account.", "success");
    console.log("User registered successfully:", response);
    
    setTimeout(()=>{
      navigate('/verify', { state: { email: data.email } });

    }, 2000);
   

    
  } catch (error: any) {
    console.error("Error during registration:", error);

    if (error.status === 400) {
    
      const errorMessage = error.data?.message || "Invalid input. Please check your data.";
      toast.error(errorMessage);
    } else { 
      toast.error("An unexpected error occurred. Please try again later.");
    }
    
  }
  finally{
    setIsLoading(false);
  }
  }


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and start your journey
          </p>
        </div>
       
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="text"
                {...register('first_name')}
                placeholder="First Name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <input 
                type="text"
                {...register("last_name")}
                placeholder="Last Name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                {...register('email')}
                placeholder="Email address"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

           
          </div>
         
          <div>
            {isLoading ? (
          <Spinner 
         
          
          />
        ) : (
           
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-950  hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-amber-400"
            >
              Sign up
            </button>
             )

        }
            <div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account? 
                <a href="/login" className="text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default Register;
