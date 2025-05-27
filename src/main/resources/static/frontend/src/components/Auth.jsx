import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null);

const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    useEffect(() =>{
        const checkSession = async () =>{
            try{
                const auth = await axios.get("http://localhost:8080/api/v1/auth/check-auth",
                    {withCredentials:true});

                setUser(auth.data);
            }catch(error){
                setUser(null);
            }
        }

        checkSession();
    },[])

    const login = user =>{
        setUser(user);
    }

    const logout = () =>{
        setUser(null);
    }

    return <AuthContext.Provider value={{user, login, logout}}>
                {children}
           </AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () =>{
    return useContext(AuthContext);
}