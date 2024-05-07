import { Box, Button, Grid, Image, Loader, Modal, Pagination, Pill, Rating, Table, Text, Title, Menu, rem } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import { showNotificaiton } from "../../utils/notifications";
import {
    IconSettings,
    IconSearch,
    IconPhoto,
    IconMessageCircle,
    IconTrash,
    IconArrowsLeftRight,
    IconProgress,
} from '@tabler/icons-react';
import { IconActivity, IconCheck, IconCircleHalf, IconCross, IconDotsCircleHorizontal, IconMenu, IconX } from "@tabler/icons";
import { statusColor } from "../../utils/statusColor";

export const Orders = () => {

    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetchAllOrders()
    }, [])

    const fetchAllOrders = async (page) => {
        setLoading(true)
        const response = await fetch(baseUrl + `orders?paginate=20&page=${page}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`,
                'Accept': 'application/json'
            }
        })
        const resp = await response.json();

        if (resp.success) {
            setOrders([...resp.data?.data])
            setTotalPages(resp.data.last_page)
            setPage(resp.data.current_page)
        }
        else {
            showNotificaiton('Error', 'Failed to fetch orders', 'error')
        }
        setLoading(false)
    }
    const changeOrderStatus = async (orderId, status) => {
        setLoading(true)
        const response = await fetch(baseUrl + `orders/update-status/${orderId}?delivery_status=${status}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`,
                'Accept': 'application/json'
            }
        })
        const resp = await response.json();

        if (resp.success) {
            fetchAllOrders(1)
        }
        else {
            showNotificaiton('Error', 'Failed to change order status', 'error')
        }
        setLoading(false)
    }

    const rows = orders?.map((element, index) => (
        <Table.Tr
            onClick={() => { setOrder(element); setModalOpen(true); }}
            className="cursor-pointer" key={element.name}>
            <Table.Td>{element?.id}</Table.Td>
            <Table.Td>{element?.user_id?.name}</Table.Td>
            <Table.Td>{element?.order_items?.length}</Table.Td>
            <Table.Td>{element?.discount}</Table.Td>
            <Table.Td>{element?.total_amount}</Table.Td>
            <Table.Td>{element?.created_at.split('T')[0]}</Table.Td>
            <Table.Td c={statusColor(element?.delivery_status.toLowerCase())}>{element?.delivery_status.toUpperCase()}</Table.Td>
            <Table.Td>{element?.payment_status.toUpperCase()}</Table.Td>
            <Table.Td>
                {/* <Button onClick={(e) => { e.stopPropagation() }} size={'sm'} bg={'red'}>Cancel</Button> */}
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Button onClick={(e) => { e.stopPropagation() }}>Action</Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Set status to</Menu.Label>
                        <Menu.Item onClick={(e) => { e.stopPropagation(); changeOrderStatus(element?.id, 'pending') }} color={statusColor('pending')} leftSection={<IconCircleHalf style={{ width: rem(14), height: rem(14) }} />}>
                            Pending
                        </Menu.Item>
                        <Menu.Item onClick={(e) => { e.stopPropagation(); changeOrderStatus(element?.id, 'accepted') }} color={statusColor('accepted')} leftSection={<IconActivity style={{ width: rem(14), height: rem(14) }} />}>
                            Accepted
                        </Menu.Item>
                        <Menu.Item onClick={(e) => { e.stopPropagation(); changeOrderStatus(element?.id, 'delivery in progress') }} color={statusColor('delivery in progress')} leftSection={<IconProgress style={{ width: rem(14), height: rem(14) }} />}>
                            Delivery in progress
                        </Menu.Item>
                        <Menu.Item onClick={(e) => { e.stopPropagation(); changeOrderStatus(element?.id, 'delivered') }} color={statusColor('delivered')} leftSection={<IconCheck style={{ width: rem(14), height: rem(14) }} />}>
                            DELIVERED
                        </Menu.Item>
                        <Menu.Item onClick={(e) => { e.stopPropagation(); changeOrderStatus(element?.id, 'cancelled') }} color={statusColor('cancelled')} leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}>
                            CANCEL
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

            </Table.Td>
        </Table.Tr>
    ));

    return <>
        <Box className="flex justify-between">
            <Title order={3}>Orders</Title>
            {/* <Button onClick={() => { setCat(null); setModalOpen(true) }} color="black">Add</Button> */}
        </Box>

        {/* <Menu shadow="md" width={200}>
            <Menu.Target>
                <IconDotsCircleHorizontal />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Set status to</Menu.Label>
                <Menu.Item color="orange" leftSection={<IconCircleHalf style={{ width: rem(14), height: rem(14) }} />}>
                    Pending
                </Menu.Item>
                <Menu.Item color="teal" leftSection={<IconActivity style={{ width: rem(14), height: rem(14) }} />}>
                    Received
                </Menu.Item>
                <Menu.Item color="blue" leftSection={<IconProgress style={{ width: rem(14), height: rem(14) }} />}>
                    Delivery in progress
                </Menu.Item>
                <Menu.Item color="green" leftSection={<IconCheck style={{ width: rem(14), height: rem(14) }} />}>
                    Completed
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}>
                    Cancel
                </Menu.Item>
            </Menu.Dropdown>
        </Menu> */}
        <Box className="flex gap-10 items-center my-5">
            <Pagination total={totalPages} value={page} onChange={fetchAllOrders} />
            {loading && <Loader size={30} />}
        </Box>
        <Box>
            <Table verticalSpacing="lg" stickyHeader withColumnBorders highlightOnHover stickyHeaderOffset={60}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ORDER ID</Table.Th>
                        <Table.Th>USER NAME</Table.Th>
                        <Table.Th>ITEMS</Table.Th>
                        <Table.Th>DISCOUNT</Table.Th>
                        <Table.Th>TOTAL PRICE</Table.Th>
                        <Table.Th>DATE</Table.Th>
                        <Table.Th>STATUS</Table.Th>
                        <Table.Th>PAYMENT</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            {order !== null && <Modal
                title={<Box className="flex flex-col gap-1">
                    <Text size="xl" fw={600}>ORDER DETAILS</Text>
                    <Text size="sm" fw={600}>STATUS: {order.delivery_status.toUpperCase()}</Text>
                    <Text size="sm" fw={600}>PAYMENT: {order.payment_status.toUpperCase()}</Text>
                </Box>}
                centered
                size={'xl'}
                opened={modalOpen}
                onClose={() => { setModalOpen(false) }}>
                <Box className="mb-3 flex justify-between border-y" >
                    <Title order={4}>{order.created_at.split('T')[0]}</Title>
                    <Title order={3}>TOTAL: RS. {order.total_amount}</Title>
                </Box>
                {order?.order_items?.map((item, index) => {

                    return <Grid key={index} className="border py-5">
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Image src={item?.product.images?.[0]?.path} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Title order={4}>{item.product.name}</Title>
                            <Box display={"flex"} className="gap-2">
                                <Pill style={{ alignSelf: 'start' }}>{item?.product.categories?.[0]?.name}</Pill>
                            </Box>

                            <Rating defaultValue={2} readOnly />
                            <Text size="sm" w={'full'} lineClamp={2}>{item?.product.description}</Text>
                            <Title order={4}>Rs. {item?.product.selling_price}</Title>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Text>Quantity: {item?.quantity}</Text>
                            <Text>Line total: {item?.line_total}</Text>
                            <Box display={'flex'} className='gap-1'>
                                <Box h={20} w={20} className='rounded-full' bg={item?.variant?.color_code} ></Box>
                                <Box h={20} w={20} className='rounded-full text-white bg-black flex justify-center items-center text-xs'>{item?.variant?.size.split(' ')[1]}</Box>
                            </Box>
                        </Grid.Col>
                    </Grid>
                })}
            </Modal>}
        </Box >

    </>
}