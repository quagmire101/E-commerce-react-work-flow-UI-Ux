import { AppShell, Avatar, Box, Burger, Button, Grid, Group, Image, PasswordInput, Popover, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { NavLink, Route, Routes, redirect } from "react-router-dom"
import Logo from '../assets/svg/logo.svg'
import { baseUrl } from "../utils/baseUrl"
import { addToForm } from "../utils/form-helper"
import { showNotificaiton } from "../utils/notifications"
import Dashboard from "./admin/Dashboard"
import Products from "./admin/Products"
import Categories from "./admin/Categories"
import AdminSingleProduct from "./admin/AdminSingleProduct"
import { Orders } from "./admin/Orders"

export default function Admin() {

    const [adminLoggedIn, setAdminLoggedIn] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('admin-token') !== null) {
            setAdminLoggedIn(true)
            return
        }
    }, [])


    return adminLoggedIn ? <AdminDashboard setAdminLoggedIn={setAdminLoggedIn} /> : <AdminLogin setAdminLoggedIn={setAdminLoggedIn} />
}

const AdminLogin = ({ setAdminLoggedIn }) => {

    const [loading, setLoading] = useState(false)

    const adminLogin = async (values) => {

        setLoading(true)
        const formData = addToForm(values)

        const response = await fetch(baseUrl + 'auth/login', {
            method: "POST",
            body: formData
        })
        const resp = await response.json();

        if (resp.success) {
            if (resp.data.role !== 'admin') {
                showNotificaiton('Error', 'Incorrect credentials', 'error')
                setAdminLoggedIn(false)
            } else {
                localStorage.setItem('admin-token', JSON.stringify(resp.data))
                showNotificaiton('Success', 'Successfully logged in')
                setAdminLoggedIn(true)
            }
        }
        else {
            showNotificaiton('Error', 'Incorrect credentials', 'error')
            setAdminLoggedIn(false)
        }
        setLoading(false)

    }

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            device: 'web'
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (value === '') return 'Password is required'
                // if (value.length < 6) return 'Should be at least 6 characters long'
                // if (!(/(?=.*[\d])/g.test(value)) || !(/(?=.*[a-z])/g.test(value)) || !(/(?=.*[A-Z])/g.test(value)) || !(/(?=.*[!@#$%^&*()_+|{}[\]:;"'<>,.?/-])/g.test(value))) {
                //     return 'Password should contain at least one special character, one uppercase letter, one lowercase letter and number'
                // }

                return null
            },
        },
    });

    return <Box className="h-[100vh] w-[100vw] flex justify-center items-center">
        <Box className="shadow rounded py-5 px-9 w-[100vh] sm:w-[80vh] md:w-[60vh] lg:w-[50vh]">
            <Title order={4}>Login</Title>
            <form onSubmit={form.onSubmit((values) => adminLogin(values))}>
                <TextInput
                    className="mt-5"
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                    disabled={loading}
                />
                <PasswordInput
                    className="mt-3"
                    withAsterisk
                    type="password"
                    label="Password"
                    placeholder="******"
                    {...form.getInputProps('password')}
                    disabled={loading}
                />


                <Group justify="flex-end" mt="md">
                    <Button loading={loading} type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
    </Box>
}

const NotFound = () => {

    redirect('/')


    return <Box display={'flex'} className="justify-center items-center h-[60.2vh]">
        <Title className="text-center" order={1} size={70}>404</Title>
    </Box>

}
const AdminDashboard = ({ setAdminLoggedIn }) => {

    const [opened, { toggle }] = useDisclosure();
    const [popOverOpened, setPopOverOpened] = useState(false);
    const admin = JSON.parse(localStorage.getItem('admin-token'))



    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Box h="100%" className="flex items-center justify-between">
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Image h={25} src={Logo} />
                    </Group>
                    <Popover opened={popOverOpened} onChange={setPopOverOpened}>
                        <Popover.Target>
                            <Box className=" flex items-center gap-3 cursor-pointer" onClick={() => { setPopOverOpened(prev => !prev) }} h="100%" px="md">
                                <Text>{admin?.name}</Text>
                                <Avatar src={admin?.avatar} />
                            </Box>
                        </Popover.Target>

                        <Popover.Dropdown >
                            <Box className="cursor-pointer hover:bg-gray-200 px-4 py-1" onClick={() => {
                                localStorage.removeItem('admin-token')
                                setAdminLoggedIn(false);
                            }}>
                                <Text >Logout</Text>
                            </Box>
                        </Popover.Dropdown>
                    </Popover>
                </Box>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink to={'/'} className={({ isActive }) => `${isActive ? 'bg-black text-white' : ''} shadow-md border-1 px-3 py-2 rounded-md mt-1`}>Dashboard</NavLink>
                <NavLink to={'/products'} className={({ isActive }) => `${isActive ? 'bg-black text-white' : ''} shadow-md border-1 px-3 py-2 rounded-md mt-1`}>Products</NavLink>
                <NavLink to={'/categories'} className={({ isActive }) => `${isActive ? 'bg-black text-white' : ''} shadow-md border-1 px-3 py-2 rounded-md mt-1`}>Categories</NavLink>
                <NavLink to={'/orders'} className={({ isActive }) => `${isActive ? 'bg-black text-white' : ''} shadow-md border-1 px-3 py-2 rounded-md mt-1`}>Orders</NavLink>

            </AppShell.Navbar>

            <AppShell.Main>

                <Routes>
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />
                    <Route
                        path="/products"
                        element={<Products />}
                    />
                    <Route
                        path="/products/:desc"
                        element={<AdminSingleProduct />}
                    />
                    <Route
                        path="/categories"
                        element={<Categories />}
                    />
                    <Route
                        path="/orders"
                        element={<Orders />}
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}