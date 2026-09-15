 import { createContext , useEffect, useState } from "react";
 import {getUser} from "./services/auth.api";
 
 
 export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);



 useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUser();
                setUser(data.user);
            } catch (error) { 
                console.error("Error fetching user:", error);
              }finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);



    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
 
}