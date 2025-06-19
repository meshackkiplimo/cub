import React from 'react'
import * as yup from 'yup';


type UserInputs = {
    email: string;
    password: string;
}
const schema = {
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
};

const Login = () => {
  return (
    <div>
      
    </div>
  )
}

export default Login
