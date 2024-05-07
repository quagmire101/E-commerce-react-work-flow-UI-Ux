import { Button, Grid, Group, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import { addToForm } from "../../utils/form-helper";
import { showNotificaiton } from "../../utils/notifications";
export const ChangePassword = () => {
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            old_password: '',
            password: '',
            password_confirmation: ''
        },

        validate: {
            old_password: (value) => value === '' ? 'Old password  is required' : null,
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

    const changePassword = async (values) => {

        setLoading(true)


        const response = await fetch(baseUrl + `auth/change-password`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`
            }
        })

        const resp = await response.json()
        if (resp.success) {
            showNotificaiton('Success', 'Password changed successfully')
            form.reset()
        } else {
            showNotificaiton('Error', 'Password change failed', 'error')
        }


        setLoading(false)
    }

    return <form onSubmit={form.onSubmit((values) => changePassword(values))}>
        <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <PasswordInput
                    className="mt-3"
                    withAsterisk
                    type="password"
                    label="Old Password"
                    placeholder="******"
                    disabled={loading}
                    {...form.getInputProps('old_password')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <PasswordInput
                    className="mt-3"
                    withAsterisk
                    type="password"
                    label="Password"
                    placeholder="******"
                    disabled={loading}
                    {...form.getInputProps('password')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>

                <PasswordInput
                    className="mt-3"
                    withAsterisk
                    type="password"
                    label="Password Confirmation"
                    placeholder="******"
                    disabled={loading}
                    {...form.getInputProps('password_confirmation')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
                <Group justify="flex-end" mt="md">
                    <Button loading={loading} type="submit">Submit</Button>
                </Group>
            </Grid.Col>
        </Grid>
    </form>
}