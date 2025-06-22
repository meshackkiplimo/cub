import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../src/Features/login/userSlice';




const Profile = () => {
    const dispatch = useDispatch();
  return (
    <div>
        <h1>Profile Page</h1>
        <button onClick={() => dispatch(logout())}>Logout</button>

      
    </div>
  )
}

export default Profile
