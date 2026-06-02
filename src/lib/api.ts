import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "./constants";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// attatching access token to every request 

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
},
(error) => {    
    return Promise.reject(error);
}
)

// response interceptor, handling 401 and refreshing token

let isRefreshing = false;
interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}
let failedQueue: QueuedRequest[] = [];

const processQ = (err:any, token:string |null = null)=>{
    failedQueue.forEach((promise)=>{
        if(err){
            promise.reject(err);
        }
        else{
            promise.resolve(token!);
        }
    })
    failedQueue = [];
}

api.interceptors.response.use((response)=>
    response,
    async (err)=>{
        const originalReq = err.config;

        // if there is no 401 and req is already rejected
        if(err.response?.status != 401 || originalReq._retry){
            return Promise.reject(err);
        }

        //if we are already refreshing rn, queing it
        if(isRefreshing){
            return new Promise((resolve, reject)=>{
                failedQueue.push({resolve, reject});
            }).then((token)=>{
                originalReq.headers.Authorization = `Bearer ${token}`;
                return api(originalReq);
            }).catch((err)=>{
                Promise.reject(err);
            })
        }

        originalReq._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
        if (!refreshToken) {
            handleLogout();
            return Promise.reject(err); 
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
            });

            const {accessToken, refreshToken: newRefreshToken} = response.data;

            // saving new tokens 
            localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
            localStorage.setItem(STORAGE_KEYS.refreshToken, newRefreshToken);

            // updating auth headers 
            originalReq.headers.Authorization = `Bearere ${accessToken}`;

            // processing queued requests 
            processQ(null, accessToken);

            //retrying original request;
            return api(originalReq);

        } catch (refreshErr) {
            processQ(refreshErr, null);
            handleLogout();
            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    }
)

const handleLogout = ()=>{
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    window.location.href = '/login';
}

export default api;