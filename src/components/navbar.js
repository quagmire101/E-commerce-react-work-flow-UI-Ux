
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import Logo from '../assets/svg/logo-white.svg'
import { BsCart3 } from "react-icons/bs";
import { IoMdLogIn } from "react-icons/io";
import { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Cart } from './nav/cart';
import { Auth } from './nav/auth';
import { Splash } from './nav/splash';
import { AppContext } from '../utils/context';

const NavbarUI = () => {

    const [cartOpen, setCartOpen] = useState(false)
    const [authOpen, setAuthOpen] = useState(false)
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext)

    const { cart } = useContext(AppContext)

    const navigate = useNavigate()

    const user = localStorage.getItem('user-token')

    return <div className='fixed z-10 w-full'>
        <Navbar className='justify-between bg-black text-white'>
            {/* <Navbar.Brand> */}
            <Link to={'/'}>
                <img src={Logo} className="mr-3 h-6 sm:h-9" alt="STRIDE" />
            </Link>
            {/* </Navbar.Brand> */}
            <div className="flex items-center gap-10 md:order-2">
                <div className='relative'>
                    <BsCart3 className='cursor-pointer' onClick={() => { setCartOpen(true) }} size={25} />
                    {cart.length > 0 && <div className='absolute -top-3 -right-3 bg-red-500 text-white h-6 w-6 rounded-full flex justify-center items-center p-0'><span>{cart?.length}</span></div>}
                </div>
                {isLoggedIn === false ?
                    <IoMdLogIn className='cursor-pointer' onClick={() => { setAuthOpen(true) }} size={25} />
                    : <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt="User settings" img={JSON.parse(localStorage.getItem('user-token'))?.avatar} rounded />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{JSON.parse(localStorage.getItem('user-token'))?.name}</span>
                            <span className="block truncate text-sm font-medium">{JSON.parse(user).email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item className='cursor-pointer' onClick={() => { navigate('/profile') }}>Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className='cusrsor-pointer' onClick={() => {
                            setIsLoggedIn(false)
                            localStorage.removeItem('user-token')
                        }} >Sign out</Dropdown.Item>
                    </Dropdown>
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <NavLink to={'/men'} style={({ isActive, isPending }) => {
                    return {
                        color: isActive ? "red" : "inherit",
                    };
                }} className='text-white text-lg'>Men</NavLink>
                <NavLink to={'/women'} style={({ isActive, isPending }) => {
                    return {
                        color: isActive ? "red" : "inherit",
                    };
                }} className='text-white text-lg'>Women</NavLink>
                <NavLink to={'/slippers'} style={({ isActive, isPending }) => {
                    return {
                        color: isActive ? "red" : "inherit",
                    };
                }} className='text-white text-lg'>Slippers</NavLink>
                <NavLink to={'/drops'} style={({ isActive, isPending }) => {
                    return {
                        color: isActive ? "red" : "inherit",
                    };
                }} className='text-white text-lg'>Drops</NavLink>
                {/* <Dropdown
                    arrowIcon={true}
                    inline
                    label={<Navbar.Link href="#" className='text-white'>Men</Navbar.Link>}
                    className='mt-5'
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </Dropdown.Header>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Earnings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown> */}
                {/* <Dropdown
                    arrowIcon={true}
                    inline
                    label={<Navbar.Link href="#" className='text-white'>Women</Navbar.Link>}
                    className='mt-5'
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </Dropdown.Header>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Earnings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown> */}
            </Navbar.Collapse>
            <Cart open={cartOpen} onClose={() => { setCartOpen(false) }} />
            <Auth open={authOpen} onClose={() => { setAuthOpen(false) }} />
            <Splash />
        </Navbar>
    </div>

}

export default NavbarUI
