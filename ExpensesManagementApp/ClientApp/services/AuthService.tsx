export const authService = {
    
    saveToken: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('access_token', accessToken); 
        localStorage.setItem('refresh_token', refreshToken);
    },
    
    getAccessToken: ()=>{
        return localStorage.getItem('access_token');
    },

    getRefreshToken: ()=>{
        return localStorage.getItem('refresh_token');
    },
    
    isLoggedIn: () => {
        return !!localStorage.getItem('access_token')
    },

    clearTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};