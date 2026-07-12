import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user details from session storage:", e);
            }
        }
        setLoading(false);
    }, []);

    const loginUserContext = (userData) => {
        setUser(userData);
    };

    const logoutUserContext = () => {
        setUser(null);
    };

    const refreshUserContext = (updatedData) => {
        setUser((prev) => {
            if (!prev) return null;
            const next = { ...prev, ...updatedData };
            
            // Sync storage
            if (localStorage.getItem("user")) {
                localStorage.setItem("user", JSON.stringify(next));
            } else if (sessionStorage.getItem("user")) {
                sessionStorage.setItem("user", JSON.stringify(next));
            }
            return next;
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUserContext, logoutUserContext, refreshUserContext }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
