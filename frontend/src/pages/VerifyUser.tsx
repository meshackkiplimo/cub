import React from 'react'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router-dom';

type VerifyUserProps = {
    email: string;
    code: string;
}
const schema = {
    email: yup.string().email("Invalid email").required("Email is required"),
    code: yup.string()
    .matches(/^\d{6}$/, "Verification code must be a 6-digit number")
    .required("Verification code is required"),
}

const VerifyUser = () => {
    const location = useLocation();
    const emailFormState = location.state?.email || '';
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifyUserProps>({
        resolver: yupResolver(yup.object().shape(schema)),
        defaultValues: {
            email: emailFormState
        }
    });
    
  return (
    <div>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verify Your Account
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(data => console.log(data))}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    {...register("email")}
                    type="email"
                    id="email"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                    readOnly
                    value={emailFormState} // Set the email value from the location state
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
    
                <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Verification Code
                </label>
                <input
                    {...register("code")}
                    type="text"
                    id="code"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.code ? 'border-red-500' : ''}`}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                </div>
    
                <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-offset-gray-100 focus:ring-indigo-500 focus:ring-offset-2"
                >
                Verify Account
                </button>
            </form>
            </div>
        </div>
      
    </div>
  )
}

export default VerifyUser
