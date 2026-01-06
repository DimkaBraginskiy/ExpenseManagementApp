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
    },
    
    createGuestSession: async ()=>{
        try{

            const response = await fetch('/api/Auth/guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if(!response.ok){
                const err = await response.json();
                throw new Error(err.error || 'Failed to create guest session.');
            }
            
            const data = await response.json();
            localStorage.setItem('access_token', data.accessToken);
            return data.accessToken;
        }catch(err : any){
            console.error("Guest session id failed: ", err);
            return null;
        }
    }
};