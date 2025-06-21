import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { UserApi } from '../../Features/users/userApi';

type Tverify={
    email: string;
    code: string;
}
const schema = yup.object({
    email:yup.string().email('Invalid email format').required('Email is required'),
    code:yup.string().required('Verification code is required')
})
const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';


    const [verifyUser] = UserApi.useVerifyUserMutation()
    
    const  {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<Tverify>({
        resolver: yupResolver(schema)
    }
    );
    const onSubmit:SubmitHandler<Tverify> = async (data) => {
        try {
            const response = await verifyUser(data).unwrap();
            console.log("Verification successful:", response);

            setTimeout(()=>{
                navigate('/login', { state: { email: data.email } });
                
            })

            
        } catch (error) {
            console.error("Verification failed:", error);
            
        }
        
    }
    
  return (
    <div>
        {/* use yup for validation */}
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-8'>
            <h1>verify your account</h1>
            <form onSubmit={handleSubmit(onSubmit)} >
                <input 
                className='mt-4 mb-2 border border-gray-300 p-2 rounded w-full '
                type="email" 
                {...register('email')}
                name="email" 
                placeholder="Enter your email" 
                required 
                readOnly
                value={emailFromState}
                />
                {(errors.email && <span className='text-red-600 text-sm' > {errors.email.message}</span>)}
                <input
                className='mt-4 mb-2 border border-gray-300 p-2 rounded w-full '
                type="text"
                {...register('code')}
                name="code"
                placeholder="Enter verification code"
                required
                />
                {(errors.code && <span  className='text-red-600 text-sm' >{errors.code.message}</span>)}
                <button 
                
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                disabled={isSubmitting}
                
                >
                    Verify
                    
                    </button>
               
            </form>
        </div>

      
    </div>
  )
}

export default Verify
