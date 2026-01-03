import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Register} from "../src/pages/Register/Register.tsx";
import {Login} from "../src/pages/Login/Login.tsx";
import {Dashboard} from "../src/pages/Dashboard/Dashboard.tsx";
import {ProtectedRoute} from "../auth/ProtectedRoute.tsx";
import {Layout} from "./components/layout/Layout.tsx";
import {Me} from "./pages/Me/Me.tsx";
import {DetailedExpense} from "./pages/DetailedExpense/DetailedExpense.tsx";


function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path={"/register"} element=
                    {
                        <Layout showHeader={false} showFooter={false}>
                            <Register/>
                        </Layout>
                }/>
                <Route path={"/login"} element=
                    {
                        <Layout showHeader={false} showFooter={false}>
                            <Login/>
                        </Layout>
                }/>
                <Route path={"/"} element=
                    {
                    <Layout showHeader={true} showFooter={true}>
                        <Dashboard/>
                    </Layout>
                }/>
                
                <Route path={"/me"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <Me/>
                        </Layout>
                    }/>
                
                <Route path={"/expenses/:id"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <DetailedExpense/>
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
export default App
