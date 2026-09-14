import axios from 'axios';

 const api= axios.create({
    baseURL: 'http://localhost:3000/api/auth',
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