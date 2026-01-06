import {authService} from "../../../services/AuthService.tsx";

export interface DecodedToken{
    role?: string | string[];
    name?: string;
    email?: string;
}

export function decodeToken(token: string | null) : DecodedToken | null {
    if(!token) return null;
    
    try{
        
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
        
    }catch(error :any){
        console.error("Invalid token: " + error)
        return null;
    }
}

export function getUserRole(): string | null{
    const token = authService.getAccessToken();
    const decoded = decodeToken(token);
    
    if(!decoded) return null;

    const roleClaim = decoded.role ||
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded['role'];
    
    if(Array.isArray(roleClaim)){
        return roleClaim[0];
    }
    return roleClaim || null;
}

export function isAdmin(): boolean{
    return getUserRole() === "Admin";
}

export function isUser(): boolean{
    return getUserRole() === "User";
}

export function isGuest(): boolean{
    return getUserRole() === "Guest";
}