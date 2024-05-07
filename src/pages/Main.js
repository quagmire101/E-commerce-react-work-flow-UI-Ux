import { Route, Routes } from "react-router-dom"
import { Footer } from "../components/footer"
import Navbar from "../components/navbar"
import Home from "./app/Home"
import Men from "./app/Men"
import { Box, Title } from "@mantine/core"
import Product from "./app/Product"
import Drops from "./app/Drops"
import Profile from "./app/Profile"
import { useContext } from "react"
import { AppContext } from "../utils/context"

const Main = () => {


    const { isLoggedIn } = useContext(AppContext)

    const NotFound = () => {

        return <Box display={'flex'} className="justify-center items-center h-[60.2vh]">
            <Title className="text-center" order={1} size={70}>404</Title>
        </Box>

    }

    return <>
        <Navbar />
        <Box className="pt-14">
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/men"
                    element={<Men />}
                />
                <Route
                    path="/women"
                    element={<Men type="WOMEN" />}
                />
                <Route
                    path="/Accessories"
                    element={<Men type="Accessories" />}
                />
                <Route
                    path="/drops"
                    element={<Drops type="DROPS" />}
                />
                <Route
                    path="/product/:id"
                    element={<Product />}
                />

                {isLoggedIn && <Route
                    path="/profile"
                    element={<Profile />}
                />}
                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </Box>
        <Footer />

    </>
}
export default Main