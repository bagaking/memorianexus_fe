import axios from "axios";

interface HostConf {
    [key: string]: {
        iam: string
        app: string
    }
}

// src/api/config.ts
const hostConf: HostConf = {
    development: {
        iam: "https://iam.kenv.tech",
        app: "https://memnexus.kenv.tech"
    },
    staging:{
        iam: "https://iam.kenv.tech",
        app: "https://memnexus.kenv.tech"
    },
    test:{
        iam: "http://47.103.66.219:8090",
        app: "http://47.103.66.219:8080"
    },
    product: {
        iam: "https://iam.kenv.tech",
        app: "https://memnexus.kenv.tech"
    },
};


const DefaultEnv:"development" | "staging" | "product" | "test" = "staging"

export const HostIAM = (env: "development" | "staging" | "product" | "test" = DefaultEnv): string => {
    return hostConf[env].iam
}

export const HostApp= (env: "development" | "staging" | "product" | "test" = DefaultEnv): string=> {
    return hostConf[env].app
}

export const HandleNetworkError = (error: any) => {
    let errorMessage = '';
    if (axios.isAxiosError(error)) {
        if (error.response) {
            errorMessage = `server error: code= ${error.response.status}; msg= ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
            const { responseURL, status, statusText } = error.request;
            errorMessage = `network error: msg= ${error.message}, status= ${status}, status_text= ${statusText}, url: ${responseURL}, config: ${JSON.stringify(error.config)}`;
        } else {
            errorMessage = `request setup error: ${error.message}`;
        }
        console.error(`Error config:`, error.config);
        console.error(`Complete error:`, error);
        return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
}
