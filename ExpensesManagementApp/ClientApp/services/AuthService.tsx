export const authService = {
    
    saveToken: (token: string, refreshToken: string) => {
        localStorage.setItem('access_token', token); 
        localStorage.setItem('refresh_token', refreshToken);
    },
    
    getToken: ()=>{
        return localStorage.getItem('access_token');
    },
    
    isLoggedIn: () => {
        return !!localStorage.getItem('access_token')
    },

    clearTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};