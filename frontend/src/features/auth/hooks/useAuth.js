import { AuthContext } from "../auth.context";

import {login, register, logout, getUser,sendOtp,verifyOtp} from "../services/auth.api";

import { useContext , useEffect } from "react";
 import {toast} from "sonner";
export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext); 

 const handleRegister = async ({username, email, password}) => {
        setLoading(true);

        try {
            const data = await register({username, email, password});
            setUser(data.user);
            toast.success("Registration successful");
        } catch (error) {
            console.log("Error registering user:", error);
            toast.error( error.response?.data?.message || "Error registering user:", error);
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
            toast.success("Login successful");
        } catch (error) {
            console.log("Error logging in user:", error);
            toast.error( error.response?.data?.message || "Error logging in user:", error);
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

    const handleSendOtp = async ({email}) => {
        setLoading(true);
        try {
            const data = await sendOtp({email});
            toast.success(data.message || "OTP sent successfully");
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error(error.response?.data?.message || "Error sending OTP");
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async ({email, otp}) => {
        setLoading(true);
        try {
            const data = await verifyOtp({email, otp});
            setUser(data.user);
            toast.success(data.message || "OTP verified successfully");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error(error.response?.data?.message || "Error verifying OTP");
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    };


    return { user, loading ,handleRegister, handleLogin, handleLogout, handleSendOtp, handleVerifyOtp };
}