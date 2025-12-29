import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Register} from "../src/pages/Register/Register.tsx";
import {Login} from "../src/pages/Login/Login.tsx";
import {Dashboard} from "../src/pages/Dashboard/Dashboard.tsx";
import {ProtectedRoute} from "../auth/ProtectedRoute.tsx";


function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path={"/register"} element={<Register/>} />
                <Route path={"/login"} element={<Login/>} />
                <Route 
                    path={"/dashboard"} 
                    element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute
                    >} 
                />

                <Route path="/" element={<Navigate to = "/dashboard" />} />
            </Routes>
        </BrowserRouter>
    )
}
export default App
