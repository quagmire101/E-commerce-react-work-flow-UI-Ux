import { Carousel } from "@mantine/carousel"
import { Box, Button, Grid, Group, Rating, TextInput, Modal, MultiSelect, Pill, Popover, Skeleton, Table, Text, Title, Select } from "@mantine/core"

import { useEffect, useState } from "react"
import InnerImageZoom from "react-inner-image-zoom"
import { useParams } from "react-router-dom"
import { baseUrl } from "../../utils/baseUrl"
import { showNotificaiton } from "../../utils/notifications"
import { useForm } from "@mantine/form"
import { addToForm } from "../../utils/form-helper"

export default function AdminSingleProduct() {

    const { desc } = useParams()
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false)
    const [variants, setVariants] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])

    const product = JSON.parse(decodeURIComponent(desc))

    const [deleteLoading, setDeleteLoading] = useState(false)

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)




    const [variant, setVariant] = useState(null)

    useEffect(() => {
        fetchColors();
        fetchSizes();
        fetchProductVariants()
    }, [])

    const fetchColors = async () => {
        const response = await fetch(baseUrl + `colors`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setColors(resp.data)
        }
        else {
            showNotificaiton('Error', 'Failed to fetch colors', 'error')
        }
    }

    const fetchSizes = async () => {
        const response = await fetch(baseUrl + `size`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setSizes(resp.data)
        }
        else {
            showNotificaiton('Error', 'Failed to fetch sizes', 'error')
        }
    }

    const fetchProductVariants = async () => {
        setLoading(true)

        const response = await fetch(baseUrl + `product-variants?product_id=${product.id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setVariants(resp.data)
        }
        else {
            showNotificaiton('Error', 'Failed to fetch product variants', 'error')
        }

        setLoading(false)
    }

    const deleteProductVariant = async (id) => {
        setDeleteLoading(true)

        const response = await fetch(baseUrl + `product-variants/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setVariant(null);
            fetchProductVariants()
            showNotificaiton('Success', resp.message, 'success')
        }
        else {
            showNotificaiton('Error', 'Failed to fetch products', 'error')
        }
        setDeleteLoading(false)
    }


    const rows = variants?.map((element) => (
        <Table.Tr key={element?.id}>
            <Table.Td>{element?.id}</Table.Td>
            <Table.Td>
                <Box h={20} w={20} bg={element?.color_code} className="rounded-full border" />
            </Table.Td>
            <Table.Td>{element?.size}</Table.Td>
            <Table.Td>{element?.quantity ?? '-'}</Table.Td>
            <Table.Td>{element?.selling_price ?? '-'}</Table.Td>
            <Table.Td>
                <Group>
                    <Button size="xs" color="blue" onClick={(e) => {
                        e.stopPropagation();
                        setVariant({ ...element }); setEditModalOpen(true);
                    }}>Edit</Button>
                    <Popover width={300} trapFocus position="bottom" withArrow shadow="md" onClose={() => {
                        setVariant(null)
                    }}>
                        <Popover.Target>
                            <Button size="xs" color="red" onClick={(e) => {
                                e.stopPropagation();
                                setOpened(e => !e)
                                setVariant({ ...product })
                            }}>Delete</Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text size="lg" mb={"xs"}>Delete Variant</Text>
                            <Text size="sm">Are you sure you want to delete this variant?</Text>
                            <Group mt={"sm"}>
                                <Button size="xs" color="black" variant="outline" onClick={() => { }}>Cancel</Button>
                                <Button loading={deleteLoading} size="xs" color="black" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProductVariant(element?.id)
                                }}>Confirm</Button>
                            </Group>
                        </Popover.Dropdown>
                    </Popover>

                </Group>
            </Table.Td>

        </Table.Tr>
    ));


    return <Box className="pt-5 xs:p-4 sm:p-6 lg:px-8">
        <Grid gutter={{ base: 0, md: 30 }}>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Carousel
                    withIndicators
                    height={'63vh'}
                    slideSize={{ base: '100%' }}
                    loop
                    align="start"
                    withControls={true}
                >
                    {product?.images?.map((item, index) => {
                        return <Carousel.Slide key={index}>
                            <InnerImageZoom
                                src={item?.path}
                                zoomSrc={item?.path}
                                zoomType="hover"
                                zoomPreload={true}
                                hideHint={true}
                                hideCloseButton={true}
                                alt={"product"}
                                zoomScale={1}
                            />
                        </Carousel.Slide>

                    })}
                </Carousel>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Box className="flex flex-col gap-3">
                    <Title order={1} >{product.name}</Title>
                    <Box display={"flex"} className="gap-2">
                        <Pill style={{ alignSelf: 'start' }}>{product?.categories?.[0]?.name}</Pill>
                    </Box>
                    <Title order={1} >Rs. {product?.selling_price}</Title>

                    <Rating defaultValue={4} readOnly />
                    <Text w={'full'}>{product?.description}</Text>
                </Box>
            </Grid.Col>
        </Grid>
        <Box className="mt-4">
            <Box className="flex justify-between mb-4">
                <Title order={2}>Variants</Title>
                <Button onClick={() => { setModalOpen(true) }} color="black">Add</Button>
            </Box>

            <Box className="mt-6">
                <Table stickyHeader stickyHeaderOffset={60}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Id</Table.Th>
                            <Table.Th>Color</Table.Th>
                            <Table.Th>Size</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                            <Table.Th>Selling Price</Table.Th>
                            <Table.Th>Action</Table.Th>

                        </Table.Tr>
                    </Table.Thead>
                    {loading && variants.length <= 0 ? <Table.Tbody>
                        {Array(8).fill(0).map((_, index) => {
                            return <Table.Tr key={index}>
                                {Array(8).fill(0).map((_, index) => {
                                    return <Table.Td key={index}><Skeleton height={30} mt={"sm"} key={index} animate /></Table.Td>
                                })}

                            </Table.Tr>
                        })}
                    </Table.Tbody>
                        :
                        <Table.Tbody>{rows}</Table.Tbody>
                    }
                </Table>
            </Box>
        </Box>
        {modalOpen && <AddEditVariants product={product} colors={colors} sizes={sizes} key={"Add"} onSuccess={() => { fetchProductVariants(); setModalOpen(false); setVariant(null) }} opened={modalOpen} onClose={() => { setModalOpen(false) }} type={'Add'} />}

        {product !== null && variant !== null && editModalOpen && <AddEditVariants product={product} colors={colors} sizes={sizes} key={'edit'} variant={variant} onSuccess={() => { fetchProductVariants(); setModalOpen(false); setVariant(null) }} opened={editModalOpen} onClose={() => { setEditModalOpen(false) }} type={'Edit'} />}
    </Box>
}


const AddEditVariants = ({ opened, onClose, product, type, colors, sizes, onSuccess, variant }) => {

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            product_id: product.id,
            color_id: variant?.color_id.toString() ?? '',
            size_id: variant?.size_id.toString() ?? '',
            cost_price: variant?.cost_price ?? '',
            selling_price: variant?.selling_price ?? '',
            quantity: variant?.quantity ?? 0

        },

        validate: {
            color_id: (value) => value === '' ? 'Color  is required' : null,
            size_id: (value) => value === '' ? 'Size  is required' : null,
            cost_price: (value) => value === '' ? 'Cost Price  is required' : null,
            selling_price: (value) => value === '' ? 'Selling Price  is required' : null,
        },
    })

    console.log(form.values)

    const addProductVariant = async (values) => {
        setLoading(true)
        const response = await fetch(baseUrl + 'product-variants', {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })
        const resp = await response.json()
        if (resp.success) {
            onSuccess()
            showNotificaiton('Success', 'Product added successfully')
        } else {
            showNotificaiton('Error', 'Product add failed', 'error')
        }
        setLoading(false)
    }

    const editProductVariant = async (values) => {
        setLoading(true)
        const response = await fetch(baseUrl + `product-variants/${variant?.id}`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })
        const resp = await response.json()
        if (resp.success) {
            onSuccess()
            showNotificaiton('Success', 'Product edited successfully')
        } else {
            showNotificaiton('Error', 'Product edit failed', 'error')
        }
        setLoading(false)
    }

    return <Modal centered opened={opened} onClose={() => {
        if (!loading) {
            form.reset()
            onClose();
        }
    }} title={`${type} Product Variant`}>
        <form onSubmit={form.onSubmit((values) => {
            if (type === 'Edit' && variant !== null) {
                editProductVariant(values)
            } else {
                addProductVariant(values)
            }
        })}>
            <Select
                className="mt-5 flex-1"
                label="Colors"
                placeholder="Pick product colors"
                data={colors.map((item) => ({ label: item.name.toString(), value: item.id.toString() }))}
                renderOption={({ option, checked }) => {
                    return <Box display={'flex'} className={`gap-4 p-2 w-full ${checked ? 'bg-gray-200' : 'white'}`}>
                        <Box h={30} w={30} bg={colors?.find((item) => item.id.toString() === option.value)?.code} className="rounded-full" />
                        <div>
                            <Text size="sm">{option.label}</Text>
                        </div>
                    </Box>
                }}

                maxDropdownHeight={300}
                disabled={loading}
                clearable
                hidePickedOptions
                {...form.getInputProps('color_id')}
            />
            <Select
                className="mt-5 flex-1"
                label="Sizes"
                placeholder="Pick product sizes"
                data={sizes.map((item) => ({ label: item.name.toString(), value: item.id.toString() }))}
                maxDropdownHeight={300}
                disabled={loading}
                clearable
                hidePickedOptions
                {...form.getInputProps('size_id')}
            />
            <TextInput
                className="mt-5"
                withAsterisk
                label="Cost Price"
                placeholder="Product cost price"
                disabled={loading}
                {...form.getInputProps('cost_price')}
            />
            <TextInput
                className="mt-5"
                withAsterisk
                label="Selling Price"
                placeholder="Product selling price"
                disabled={loading}
                {...form.getInputProps('selling_price')}
            />
            <TextInput
                className="mt-5"
                withAsterisk
                label="Quantity"
                placeholder="Product quantity"
                disabled={loading}
                {...form.getInputProps('quantity')}
            />

            <Button loading={loading} className="mt-5" color="black" type="submit">{type}</Button>
        </form>
    </Modal>
}