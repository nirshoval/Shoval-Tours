import axios, { InternalAxiosRequestConfig } from "axios";

class Interceptor {
	
    // Create interceptor:
    public create(): void{
        
        // Register to axios interceptors: 
        axios.interceptors.request.use((requestConfig: InternalAxiosRequestConfig)=>{
             
        // Take token from local storage:
        const token = localStorage.getItem("token");

        // Add bearer token to any request
        requestConfig.headers.Authorization = "Bearer " + token;

        // Return config:
        return requestConfig;

        });
    }
}

export const interceptor = new Interceptor();
