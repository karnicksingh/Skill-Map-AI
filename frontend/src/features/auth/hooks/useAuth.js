import { AuthContext } from "../auth.context";

import {login, register, logout, getUser} from "../services/auth.api";

import { useContext } from "react";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext); 

 const handleRegister = async ({username, email, password}) => {
        setLoading(true);

        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            console.log("Error registering user:", error);
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
        } finally {
            setLoading(false);
        }
    };

    return { user, handleRegister, handleLogin, handleLogout };
}