import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Register} from "./pages/Register.tsx";
import {Login} from "./pages/Login.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";


function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path={"/register"} element={<Register/>} />
                <Route path={"/login"} element={<Login/>} />
                <Route path={"/dashboard"} element={<Dashboard/>} />
            </Routes>
        </BrowserRouter>
    )
}
export default App
