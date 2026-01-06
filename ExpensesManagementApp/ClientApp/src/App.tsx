import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Register} from "../src/pages/Register/Register.tsx";
import {Login} from "../src/pages/Login/Login.tsx";
import {Dashboard} from "../src/pages/Dashboard/Dashboard.tsx";
import {ProtectedRoute} from "../auth/ProtectedRoute.tsx";
import {Layout} from "./components/layout/Layout.tsx";
import {Me} from "./pages/Me/Me.tsx";
import {DetailedExpense} from "./pages/DetailedExpense/DetailedExpense.tsx";
import {CreateExpense} from "./pages/CreateExpense/CreateExpense.tsx";
import {EditExpense} from "./pages/EditExpense/EditExpense.tsx";
import {MeEdit} from "./pages/MeEdit/MeEdit.tsx";
import React from "react";
import {UserProfile} from "./pages/Me/UserProfile.tsx";
import {UserProfileEdit} from "./pages/MeEdit/UserProfileEdit.tsx";


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
                            <UserProfile/>
                        </Layout>
                    }/>
                
                <Route path={"/expenses/:id"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <DetailedExpense/>
                        </Layout>
                    }
                />
                
                <Route path={"/expenses/create"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <CreateExpense/>
                        </Layout>
                    } 
                />
                
                <Route path={"/expenses/:id/edit"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <EditExpense/>
                        </Layout>
                    }
                />

                <Route path={"/me/edit"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <UserProfileEdit/>
                        </Layout>
                    }
                />
                
                <Route path={"/users/:email"} element=
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <UserProfile/>
                        </Layout>
                    }
                />
                
                <Route path={"/users/:email/edit"}element = 
                    {
                        <Layout showHeader={true} showFooter={true}>
                            <UserProfileEdit/>
                        </Layout>   
                    }
                />
            </Routes>
            
            
        </BrowserRouter>
    )
}
export default App
