import { Box, Grid, GridCol, Image, Loader, Modal, Pill, Rating, Table, Text, Title, Tooltip } from "@mantine/core";
import { Button } from "flowbite-react";
import { useState } from "react";
import { showNotificaiton } from "../../utils/notifications";
import { baseUrl } from "../../utils/baseUrl";
import { statusColor } from "../../utils/statusColor";


export const OrderList = ({ orders = [], fetchAllOrders }) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentOrderId, setCurrentOrderId] = useState(null)

    const changeOrderStatus = async (orderId, status) => {
        setLoading(true)
        const response = await fetch(baseUrl + `orders/update-status/${orderId}?delivery_status=${status}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`,
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
        <Table.Tr onClick={() => { setOrder(element); setModalOpen(true); }} className="cursor-pointer" key={element.id}>
            <Table.Td>{element?.id}</Table.Td>
            <Table.Td>{element?.order_items?.length}</Table.Td>
            <Table.Td>{element?.total_amount}</Table.Td>
            <Table.Td>{element?.created_at.split('T')[0]}</Table.Td>
            <Table.Td c={statusColor(element?.delivery_status.toLowerCase())}>{element?.delivery_status.toUpperCase()}</Table.Td>
            <Table.Td>{element?.payment_status.toUpperCase()}</Table.Td>
            {element.delivery_status === 'pending' && <Table.Td>
                <Tooltip label="If paid, contact admin for refund">
                    <Button onClick={(e) => { e.stopPropagation(); setCurrentOrderId(element.id); changeOrderStatus(element?.id, 'cancelled') }} size={'sm'} className="bg-red-500">
                        {loading && element.id === currentOrderId ? <Loader c={"white"} size={'xs'} /> : 'Cancel'}
                    </Button>
                </Tooltip>

            </Table.Td>}
        </Table.Tr>
    ));

    return (
        <Box>
            <Table verticalSpacing="lg" stickyHeader withColumnBorders highlightOnHover stickyHeaderOffset={60}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ORDER ID</Table.Th>
                        <Table.Th>ITEMS</Table.Th>
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
    );
}