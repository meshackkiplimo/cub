import React from 'react'
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';

type UserInputs = {
    // user_id: number;
     first_name: string
     last_name: string;
     email: string;
     password: string;
     role: string;
     is_verified: boolean;
};
const schema = {
    first_name:yup.string().required("First name is required"),
    last_name:yup.string().required("Last name is required"),
    email:yup.string().email("Invalid email").required("Email is required"),
    password:yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
    role:yup.string().oneOf(["admin", "customer"], "Role must be either admin or customer").required("Role is required"),
    is_verified:yup.boolean().default(false)
};


const Register = () => {
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors } } = useForm<UserInputs>();
  const onSubmit: SubmitHandler<UserInputs> = data => console.log(data);

  return (
    <div>
    
    <form onSubmit={handleSubmit(onSubmit)}>
      
     
        <input
          type="text"
          {...register('first_name')}
          placeholder="First Name"
          className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
        />

        {errors.first_name && (
        <span className=" text-red-700 text-sm">{errors.first_name.message}</span>
        )}
    
      <input 
      type='text'
      
      {...register("last_name", { required: true})}
        placeholder='Last Name'
        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '

      
      />
     
        {errors.last_name && (
            <span className=" text-red-700 text-sm">{errors.last_name.message}</span>
        )}
        <input
            type="email"
            {...register('email')}
            placeholder="Email"
            className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
        />
        {errors.email && (
            <span className=" text-red-700 text-sm">{errors.email.message}</span>
        )}
        <input
            type="password"
            {...register('password')}
            placeholder="Password"
            className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
        />
        {errors.password && (
            <span className=" text-red-700 text-sm">{errors.password.message}</span>
        )}
        <select
            {...register('role')}
            className='select border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
        >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
        </select>
        {errors.role && (
            <span className=" text-red-700 text-sm">{errors.role.message}</span>
        )}
        
      
      <input type="submit" />
    </form>
      
    </div>
  )
}

export default Register
