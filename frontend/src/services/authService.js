import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const login = async (userData) => {

    const response = await axios.post(
        `${API}/login`,
        userData
    );

    return response.data;
};

export const register = async (userData) => {

    const response = await axios.post(
        `${API}/register`,
        userData
    );

    return response.data;
};