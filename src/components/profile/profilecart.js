
import { ActionIcon, Box, Button, Image, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { AppContext } from "../../utils/context";
import { CartItem, CheckoutButton } from "../nav/cart";

export const ProfileCart = () => {

    const { cart, isLoggedIn } = useContext(AppContext)

    return <Box className='flex flex-col gap-10 justify-between'>
        <Box className='overflow-y-auto flex flex-col gap-3 h-[50vh]'>
            {cart?.map((item, index) => {
                return <CartItem key={index} item={item} />
            })}
        </Box>
        <Box className='flex flex-col gap-3'>
            <Box className='flex justify-between'>
                <Text size='sm' fw={500}>SHIPPING: </Text>
                <Text size='sm' fw={500}>FREE SHIPPING </Text>
            </Box>
            <Box className='flex justify-between'>
                <Text size='xl' fw={600}>TOTAL: </Text>
                <Text size='xl' fw={600}>Rs. {cart.reduce((a, b) => a + (b?.quantity * b?.variant?.selling_price), 0)} </Text>
            </Box>
            {isLoggedIn ?
                <CheckoutButton /> :
                <Button disabled>Please login to checkout</Button>
            }
        </Box>
    </Box>
}