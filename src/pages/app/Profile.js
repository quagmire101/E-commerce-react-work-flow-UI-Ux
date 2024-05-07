import { Box, FileButton, Image, Loader, SegmentedControl, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { ChangePassword } from "../../components/profile/changepassword";
import { EditProfile } from "../../components/profile/editprofile";
import { ProfileCart } from "../../components/profile/profilecart";
import { OrderList } from "../../components/profile/orderlist";
import { showNotificaiton } from "../../utils/notifications";
import { baseUrl } from "../../utils/baseUrl";

export default function Profile() {

    const user = JSON.parse(localStorage.getItem('user-token'))

    const [value, setValue] = useState('edit');
    const [imageLoading, setImageLoading] = useState(false)

    const [orders, setOrders] = useState([])

    useEffect(() => {
        console.log(window.location.hash.substring(1))
        if (window.location.hash.substring(1) !== '') {
            setValue(window.location.hash.substring(1))
            window.history.pushState({}, "", window.location.origin + "/profile");

        }
        fetchAllOrders()
    }, [])

    const fetchAllOrders = async () => {
        const response = await fetch(baseUrl + 'orders', {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`,
                'Accept': 'application/json'
            }
        })
        const resp = await response.json();

        if (resp.success) {
            setOrders([...resp.data.data])
        }
        else {
            showNotificaiton('Error', 'Failed to fetch orders', 'error')
        }
    }

    const uploadImage = async (file) => {

        setImageLoading(true)

        var formData = new FormData();
        formData.append('avatar', file)
        formData.append('name', user.name)
        formData.append('phone', user.phone)
        formData.append('address', user.address)


        const response = await fetch(baseUrl + `auth/update-profile`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`
            }
        })

        const resp = await response.json()
        if (resp.success) {
            localStorage.setItem('user-token', JSON.stringify(resp.data))
            showNotificaiton('Success', 'Image uploaded successfully')
            window.location.reload()
        } else {
            showNotificaiton('Error', 'Image upload failed', 'error')
        }


        setImageLoading(false)
    }

    return <Box className="pt-5 xs:p-4 sm:p-6 lg:px-8">
        <Box className="flex flex-col items-center gap-5 justify-center">
            <Box className="h-[15rem] w-[15rem] relative">
                <Image className="h-full" radius={150} src={user?.avatar} />
                <Box onClick={() => { }} className="cursor-pointer absolute bottom-0 right-10 border-2 border-white p-3 bg-black rounded-full">
                    {imageLoading ?
                        <Loader m={0} p={0} color="white" size={20} />
                        : <FileButton onChange={uploadImage} accept="image/png,image/jpeg">
                            {(props) => <FaPen {...props} className="text-white" />}
                        </FileButton>
                    }
                </Box>
            </Box>
            <Box className="text-center">
                <Title order={2}>{user?.name}</Title>
                <Text size="xl">{user?.address}</Text>
                <Text>{user?.phone}</Text>
            </Box>
        </Box>
        <Box className="mt-9">
            <SegmentedControl
                fullWidth
                color="black"
                size="lg"
                value={value}
                withItemsBorders
                onChange={setValue}
                data={[
                    { label: <Text size="lg" fw={600}>EDIT PROFILE</Text>, value: 'edit' },
                    { label: <Text size="lg" fw={600}>CHANGE PASSWORD</Text>, value: 'change' },
                    { label: <Text size="lg" fw={600}>MY CART</Text>, value: 'cart' },
                    { label: <Text size="lg" fw={600}>MY ORDERS</Text>, value: 'orders' },
                ]}
            />
            <Box bg={"#d1d1d120"} className="p-5">
                {value === 'edit' ?
                    <EditProfile user={user} />
                    : value === 'change' ?
                        <ChangePassword />
                        :
                        value === 'cart' ? <ProfileCart />
                            :
                            <OrderList orders={orders} fetchAllOrders={fetchAllOrders} />
                }
            </Box>
        </Box>
    </Box>
}


