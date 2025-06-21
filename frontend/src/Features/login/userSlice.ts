import { createSlice } from '@reduxjs/toolkit';




export type TLoginResponse ={
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    } | null;
}

const initialState = {
    token :null,
    user: null

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        }
    }
})

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;