import { Box, Button, Group, Modal, PasswordInput, SegmentedControl, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import { showNotificaiton } from "../../utils/notifications";
import { addToForm } from "../../utils/form-helper";
import { AppContext } from "../../utils/context";

export const Auth = ({ open, onClose }) => {
    const [value, setValue] = useState('login');

    return (<>
        <Modal className="transition-all duration-500" opened={open} onClose={onClose} title="Authentication" centered>
            <SegmentedControl
                fullWidth
                value={value}
                onChange={setValue}
                data={[
                    { label: 'Login', value: 'login' },
                    { label: 'Sign up', value: 'signup' },
                ]}
            />
            {value === 'login' ? <Box>
                <Login onClose={onClose} />
            </Box> :
                <Box>
                    <SignUp onClose={onClose} />
                </Box>
            }
        </Modal>
    </>
    );

}


const Login = ({ onClose }) => {

    const { setIsLoggedIn } = useContext(AppContext)
    const [loading, setLoading] = useState(false)

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
                if (value.length < 6) return 'Should be at least 6 characters long'
                if (!(/(?=.*[\d])/g.test(value)) || !(/(?=.*[a-z])/g.test(value)) || !(/(?=.*[A-Z])/g.test(value)) || !(/(?=.*[!@#$%^&*()_+|{}[\]:;"'<>,.?/-])/g.test(value))) {
                    return 'Password should contain at least one special character, one uppercase letter, one lowercase letter and number'
                }

                return null
            },
        },
    });

    const login = async (values) => {
        setLoading(true)

        const response = await fetch(baseUrl + 'auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: addToForm(values)
        })
        const resp = await response.json()

        if (resp.success) {
            showNotificaiton('Success', 'Login successful', 'success')
            setIsLoggedIn(true)
            localStorage.setItem('user-token', JSON.stringify(resp.data))
            onClose()
        } else {
            showNotificaiton('Error', 'Something went wrong while trying to login', 'error')
        }
        setLoading(false)
    }

    return <form onSubmit={form.onSubmit((values) => login(values))}>
        <TextInput
            className="mt-5"
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            disabled={loading}
            {...form.getInputProps('email')}
        />
        <PasswordInput
            className="mt-3"
            withAsterisk
            type="password"
            label="Password"
            placeholder="******"
            disabled={loading}
            {...form.getInputProps('password')}
        />


        <Group justify="flex-end" mt="md">
            <Button loading={loading} type="submit">Submit</Button>
        </Group>
    </form>
}

const SignUp = ({ onClose }) => {

    const { setIsLoggedIn } = useContext(AppContext)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            password: '',
            email: '',
            password_confirmation: '',
            device: 'web'
        },

        validate: {
            name: (value) => value === '' ? 'Name  is required' : null,
            address: (value) => value === '' ? 'Address  is required' : null,
            phone: (value) => value === '' ? 'Contact  is required' : null,
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (value === '') return 'Password is required'
                if (value.length < 6) return 'Should be at least 6 characters long'
                if (!(/(?=.*[\d])/g.test(value)) || !(/(?=.*[a-z])/g.test(value)) || !(/(?=.*[A-Z])/g.test(value)) || !(/(?=.*[!@#$%^&*()_+|{}[\]:;"'<>,.?/-])/g.test(value))) {
                    return 'Password should contain at least one special character, one uppercase letter, one lowercase letter and number'
                }

                return null
            },
            password_confirmation: (value, values) => {
                if (value === values.password) return null
                return "Passwords don't match";
            },
        },
    });

    const register = async (values) => {
        setLoading(true)

        const response = await fetch(baseUrl + 'auth/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: addToForm(values)
        })
        const resp = await response.json()

        if (resp.success) {
            showNotificaiton('Success', 'Registration successful', 'success')
            setIsLoggedIn(true)
            localStorage.setItem('user-token', JSON.stringify(resp.user))
            onClose()
        } else {
            showNotificaiton('Error', 'Something went wrong while trying to register', 'error')
        }
        setLoading(false)
    }

    return <form onSubmit={form.onSubmit((values) => register(values))}>
        <TextInput
            className="mt-5"
            withAsterisk
            label="Full name"
            placeholder="John Doe"
            disabled={loading}
            {...form.getInputProps('name')}
        />
        <TextInput
            className="mt-5"
            withAsterisk
            label="Address"
            placeholder="Maven street 123"
            disabled={loading}
            {...form.getInputProps('address')}
        />
        <TextInput
            className="mt-5"
            withAsterisk
            label="Phone"
            placeholder="+977 9800000000"
            disabled={loading}
            {...form.getInputProps('phone')}
        />
        <TextInput
            className="mt-5"
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            disabled={loading}
            {...form.getInputProps('email')}
        />
        <PasswordInput
            className="mt-3"
            withAsterisk
            type="password"
            label="Password"
            disabled={loading}
            placeholder="******"
            {...form.getInputProps('password')}
        />
        <PasswordInput
            className="mt-3"
            withAsterisk
            type="password"
            disabled={loading}
            label="Password Confirmation"
            placeholder="******"
            {...form.getInputProps('password_confirmation')}
        />


        <Group justify="flex-end" mt="md">
            <Button loading={loading} type="submit">Submit</Button>
        </Group>
    </form>
}