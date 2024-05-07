import { Button, Grid, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { showNotificaiton } from "../../utils/notifications";
import { baseUrl } from "../../utils/baseUrl";
import { addToForm } from "../../utils/form-helper";

export const EditProfile = ({ user }) => {

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            name: user?.name ?? '',
            address: user?.address ?? '',
            phone: user?.phone ?? '',
            email: user?.email ?? ''
        },

        validate: {
            name: (value) => value === '' ? 'Name  is required' : null,
            address: (value) => value === '' ? 'Address  is required' : null,
            phone: (value) => value === '' ? 'Contact  is required' : null,
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const editProfile = async (values) => {

        setLoading(true)


        const response = await fetch(baseUrl + `auth/update-profile`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`
            }
        })

        const resp = await response.json()
        if (resp.success) {
            localStorage.setItem('user-token', JSON.stringify(resp.data))
            showNotificaiton('Success', 'Profile edited successfully')
            window.location.reload()
        } else {
            showNotificaiton('Error', 'Profile edit failed', 'error')
        }


        setLoading(false)
    }

    return <form onSubmit={form.onSubmit((values) => editProfile(values))}>
        <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                    size="md"
                    withAsterisk
                    label="Full name"
                    placeholder="John Doe"
                    disabled={loading}
                    {...form.getInputProps('name')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                    size="md"
                    withAsterisk
                    label="Address"
                    placeholder="Maven street 123"
                    disabled={loading}
                    {...form.getInputProps('address')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                    size="md"
                    withAsterisk
                    label="Phone"
                    disabled={loading}
                    placeholder="+977 9800000000"
                    {...form.getInputProps('phone')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <TextInput
                    size="md"
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                    disabled
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
                <Group justify="flex-end" mt="md">
                    <Button loading={loading} disabled={!form.isDirty()} type="submit">Submit</Button>
                </Group>
            </Grid.Col>
        </Grid>
    </form>
}
