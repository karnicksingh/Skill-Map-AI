import axios from 'axios';

const BASE_URL = import.meta.env.VITE_MODE === 'production'
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_LOCAL;

 const api= axios.create({
    baseURL: `${BASE_URL}/auth`,
    withCredentials: true
  });

export async function register({username,email,password}) {

    try {   

 const response = await api.post('/register', {
        username,
        email,
        password
    },{
        withCredentials: true
    });
     
    return response.data;

    }catch (error) {
        console.log('Error registering user:', error);
        
    }

   
}


export async function login({email,password}){
     try{
         const response = await api.post('/login', {
            email,
            password
        },{
            withCredentials: true
        });

        return response.data;

     }catch(error){
        console.log('Error logging in user:', error);
        throw error; // Rethrow the error to be handled by the caller
     }
}


export async function logout(){
    try{
        const response = await api.post('/logout');

        return response.data;

     }catch(error){
        console.error('Error logging out user:', error);
     }
}


export async function getUser(){
    try{
        const response = await api.get('/get-user');

        return response.data;

     }catch(error){
        console.error('Error getting user:', error);
    }
}


export async function sendOtp({ email }) {
    try {
        const response = await api.post('/send-otp', { email });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}


export async function verifyOtp({ email, otp }) {
    try {
        const response = await api.post('/verify-otp', { email, otp });
        return response.data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}