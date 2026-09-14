import { AuthContext } from "../auth.context";

import {login, register, logout, getUser} from "../services/auth.api";

import { useContext , useEffect } from "react";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext); 

 const handleRegister = async ({username, email, password}) => {
        setLoading(true);

        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            console.log("Error registering user:", error);
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    };



    const handleLogin = async ({email, password}) => {
        setLoading(true);

        try {
            const data = await login({email, password});
            setUser(data.user);
        } catch (error) {
            console.log("Error logging in user:", error);
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = async () => {
        setLoading(true);   
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Error logging out user:", error);
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    };



 useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUser();
                setUser(data.user);
                setLoading(false);
            } catch (error) { 
                console.error("Error fetching user:", error);
              }
        };
        fetchUser();
    }, []);




    return { user, loading ,handleRegister, handleLogin, handleLogout };
}