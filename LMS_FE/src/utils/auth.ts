import { jwtDecode } from "jwt-decode";


export const getUserFromToken = () => {
    const token = localStorage.getItem("token");

    if(!token){
        return null;
    }

    try{
        const decodedToken : any = jwtDecode(token);

        const role = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        return {
            token ,
            role ,
            decodedToken
        };
    } catch {
        return null;
    }
};