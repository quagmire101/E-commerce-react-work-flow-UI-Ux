import { createContext, useEffect, useState } from "react";


export const AppContext = createContext()


export const ContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user-token') !== null)
    const [splashLoading, setSplashLoading] = useState(false)
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) ?? [])

    return <AppContext.Provider value={{ splashLoading, setSplashLoading, cart, setCart, isLoggedIn, setIsLoggedIn }}>
        {children}
    </AppContext.Provider>
}

