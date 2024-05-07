
import { ActionIcon, Box, Button, Drawer, Grid, GridCol, Group, Image, Modal, Switch, Text, TextInput, Title } from '@mantine/core';
import { useContext, useState } from 'react';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { AppContext } from '../../utils/context';
import { useCounter } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { baseUrl } from '../../utils/baseUrl';
import { addToForm } from '../../utils/form-helper';
import { showNotificaiton } from '../../utils/notifications';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51P4GnnSHva8YJndUrfos3SklL7883klOUtwWawOvJEd5LL9us2MMVZSOxI1ril2TLkMd7tLm46U1kf0lruvAaMW000uh1dH4Y6');

export const Cart = ({ open, onClose }) => {

    const { cart, isLoggedIn } = useContext(AppContext)


    return <Drawer
        offset={8}
        radius="md"
        opened={open}
        onClose={onClose}
        title="My Cart"
        position='right'
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
        <Box className='flex flex-col gap-10 justify-between h-[90vh]'>
            <Box className='overflow-y-auto flex flex-col gap-3'>
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
                    <CheckoutButton onClose={onClose} /> :
                    <Button disabled>Please login to checkout</Button>
                }
            </Box>
        </Box>
    </Drawer>
}

export const CheckoutButton = ({ onClose }) => {
    const { cart, setCart } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [checkOutModal, setCheckOutModal] = useState(false)
    const [clientSecret, setClientSecret] = useState(null)

    const [COD, setCOD] = useState(false);

    const form = useForm({
        initialValues: {
            // shipping_address: localStorage.getItem('shipping_address') ?? '',
            line1: localStorage.getItem('line1') ?? '',
            postal_code: localStorage.getItem('postal_code') ?? "",
            city: localStorage.getItem('city') ?? "",
            state: localStorage.getItem('state') ?? "",
            country: localStorage.getItem('country') ?? "Nepal",
            products: cart.map((item) => ({ product_id: item.product.id, quantity: item.quantity, variant_id: item.variant.id })),
            create_payment_intent: 1
        },

        validate: {
            shipping_address: (value) => value === '' ? 'Shipping address  is required' : null,
        }
    })

    const placeOrder = async (values) => {
        setLoading(true)

        localStorage.setItem('line1', values.line1)
        localStorage.setItem('postal_code', values.postal_code)
        localStorage.setItem('city', values.city)
        localStorage.setItem('state', values.state)
        localStorage.setItem('country', values.country)

        const response = await fetch(baseUrl + `place-order`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`,
                'Accept': 'application/json'
            }
        })

        const resp = await response.json()
        if (resp.success) {
            if (values.create_payment_intent === 1) {
                setClientSecret(resp.data.client_secret)
            } else {
                onClose?.()
                showNotificaiton('Success', 'Order placed successfully')
                setCart([])
                localStorage.removeItem('cart')
            }
        } else {
            showNotificaiton('Error', 'Order place failed', 'error')
        }

        setLoading(false)
    }

    console.log('Client Secret', clientSecret)

    return <>
        <Button onClick={() => { setCheckOutModal(true) }} color='black' fullWidth size='xl'>CHECKOUT</Button>
        <Modal opened={checkOutModal} centered onClose={() => { setCheckOutModal(false); form.reset() }} title="Order">
            {clientSecret === null && <>
                <form onSubmit={form.onSubmit((values) => placeOrder(values))}>
                    <Grid>
                        <Grid.Col span={{ base: 12 }}>
                            <TextInput
                                size="md"
                                withAsterisk
                                label="Line 1"
                                placeholder="Address line 1"
                                disabled={loading}
                                {...form.getInputProps('line1')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                size="md"
                                withAsterisk
                                label="Postal Code"
                                placeholder="Postal Code"
                                disabled={loading}
                                {...form.getInputProps('postal_code')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                size="md"
                                withAsterisk
                                label="City"
                                placeholder="City"
                                disabled={loading}
                                {...form.getInputProps('city')}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                size="md"
                                withAsterisk
                                label="State"
                                placeholder="State"
                                disabled={loading}
                                {...form.getInputProps('state')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                size="md"
                                withAsterisk
                                label="Country"
                                placeholder="Country"
                                disabled={true}
                                {...form.getInputProps('country')}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12 }}>
                            <Switch
                                checked={COD}
                                onChange={(event) => {
                                    setCOD(event.currentTarget.checked)
                                    form.setFieldValue('create_payment_intent', event.currentTarget.checked ? 0 : 1)
                                }}
                                label="Cash on delivery"
                            />
                        </Grid.Col>

                        {COD ? <Grid.Col span={{ base: 12 }}>
                            <Group justify="flex-end" mt="md">
                                <Button loading={loading} type="submit">Place Order</Button>
                            </Group>
                        </Grid.Col> :
                            <Grid.Col span={{ base: 12 }}>
                                <Group justify="flex-end" mt="md">
                                    <Button type="submit" loading={loading}>Continue</Button>
                                </Group>
                            </Grid.Col>
                        }

                    </Grid>
                </form>
            </>}
            {
                clientSecret !== null &&
                <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                    <CheckoutForm onSuccess={() => {
                        setCart([])
                        localStorage.removeItem('cart')
                    }} />
                </Elements>
            }
        </Modal>
    </>
}



const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        setLoading(true)
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }


        onSuccess()
        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/profile#orders`,
            },
        });


        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            onSuccess()
        }

        setLoading(false)
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button loading={loading} type='submit' mt={20} disabled={!stripe}>Submit</Button>
        </form>
    )
};




export const CartItem = ({ item }) => {

    const { cart, setCart } = useContext(AppContext)

    const handleQuantityChange = (type) => {

        if (type === 'decrease' && item.quantity <= 1) return
        if (type === 'increase' && item.quantity >= item?.product?.available_quantity) return

        let temp = { ...item }
        if (type === 'decrease') {
            temp.quantity = temp.quantity - 1
        } else {
            temp.quantity = temp.quantity + 1
        }

        let tempList = [...cart]
        const prdIndex = tempList.indexOf(i => i.id === item.id)

        tempList.splice(prdIndex, 1, temp)

        setCart(prev => {
            localStorage.setItem('cart', JSON.stringify([...tempList]))
            return [...tempList]
        })

    }

    return <Box className='flex gap-3 shadow border relative'>
        <div onClick={() => {
            let tempList = [...cart]
            const prdIndex = tempList.indexOf(i => i.id === item.id)

            tempList.splice(prdIndex, 1)

            setCart((_) => {
                localStorage.setItem('cart', JSON.stringify([...tempList]))
                return [...tempList]
            })
        }} className='cursor-pointer absolute top-1 right-1 bg-red-500 text-white h-6 w-6 rounded-full flex justify-center items-center p-0'><span>x</span></div>

        <Image h={150} w={150} src={item?.product?.images?.[0]?.path} />
        <Box className='flex flex-col'>
            <Title order={4}>{item?.product?.name}</Title>
            <Text w={'full'} size='sm' lineClamp={1}>{item?.product?.description}</Text>
            <Box display={'flex'} className='gap-1'>
                <Box h={20} w={20} className='rounded-full' bg={item?.variant?.color_code} ></Box>
                <Box h={20} w={20} className='rounded-full text-white bg-black flex justify-center items-center text-xs'>{item?.variant?.size.split(' ')[1]}</Box>
            </Box>
            <Box className='flex gap-3 items-center my-3'>
                <ActionIcon onClick={() => { handleQuantityChange('decrease') }} radius={'xl'} variant="filled" aria-label="Settings">
                    <CiCircleMinus size={30} />
                </ActionIcon>
                <Text size='lg' fw={600}>{item.quantity}</Text>
                <ActionIcon onClick={() => { handleQuantityChange('increase') }} radius={'xl'} variant="filled" aria-label="Settings">
                    <CiCirclePlus size={30} />
                </ActionIcon>
            </Box>
            <Text size='lg' fw={600}>Rs. {item?.variant?.selling_price} </Text>
        </Box>
    </Box>
}