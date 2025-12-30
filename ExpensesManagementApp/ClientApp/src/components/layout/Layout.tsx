import type {ReactNode} from "react";

import styles from "./Layout.module.css";
import {Header} from "./Header.tsx";
import {Footer} from "./Footer.tsx";

interface LayoutProperties{
    children : ReactNode;
    showHeader : boolean;
    showFooter : boolean;
}


export function Layout(
    {
        children,
        showHeader,
        showFooter
    } :LayoutProperties
){
    return(
        <div className={styles.container}>
            {showHeader && <Header/>}

            <main className={styles.main}>
                {children}
            </main>
            
            {showFooter && <Footer/>}
        </div>
    );
}