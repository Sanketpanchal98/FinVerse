import axios from "axios";
import { store } from "../Store/Store";
import { removeUser } from "../Slices/AuthSlice";

const baseURI = axios.create({
    baseURL : import.meta.env.VITE_AUTOPAY_API_URL,
    withCredentials : true
})

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

const addAutopay = async (data) => await baseURI.post('/create' , data, {
    withCredentials : true
})

const removeAutopay = async (data) => await baseURI.get(`/delete/${data}` , {
    withCredentials : true
})

const editAutopay = async (autopayId, data) => await baseURI.post(`/edit/${autopayId}`, data, {
    withCredentials : true
})

const fetchAll = async () => await baseURI.get('/all', {
    withCredentials : true
})

export {
    addAutopay,
    removeAutopay,
    editAutopay,
    fetchAll
}