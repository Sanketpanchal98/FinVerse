import axios from "axios";
import { store } from '../Store/Store';
import { removeUser } from '../Slices/AuthSlice';

const baseURI = axios.create({
    baseURL: import.meta.env.VITE_USER_PRO_API_URL,
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
};

baseURI.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // console.log(error.response.data.error.statusCode);
        if (
            
            error.response.data.error.statusCode === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/refresh-token"
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => baseURI(originalRequest));
            }

            isRefreshing = true;

            try {                
                await baseURI.post('/refresh-token', {}, { withCredentials: true });
                processQueue(null);
                originalRequest.withCredentials = true;
                return baseURI(originalRequest);
            } catch (refreshError) {
                // console.log("❌ Refresh token failed:", refreshError.response?.data || refreshError.message);
                processQueue(refreshError, null);
                store.dispatch(removeUser());
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


const userRootReq = async () => await baseURI.get('/pro/info', {
    withCredentials: true
})

const userRegister = async (data) => await baseURI.post('/register', data, {
    withCredentials: true
})
const userLogin = async (data) => await baseURI.post('/login', data, {
    withCredentials: true
});

const userLogout = async () => await baseURI.get('/pro/logout', {
    withCredentials: true
});

const passwordUpdate = async (data) => await baseURI.post('/pro/updatepass', data, {
    withCredentials : true
});

const dataUpdate = async (data) => await baseURI.post('/pro/update', data, {
    withCredentials : true
})

const emailUpdate = async (data) => await baseURI.post('/pro/updatemail', data, {
    withCredentials : true
})

export {
    userLogin,
    userRegister,
    userLogout,
    userRootReq,
    passwordUpdate,
    dataUpdate,
    emailUpdate
}