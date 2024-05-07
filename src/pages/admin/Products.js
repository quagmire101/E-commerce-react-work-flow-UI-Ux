import { Box, Button, FileButton, FileInput, Group, Image, Loader, Modal, MultiSelect, Pagination, Popover, Select, Skeleton, Table, Text, TextInput, Textarea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import { showNotificaiton } from "../../utils/notifications";
import { useForm } from "@mantine/form";
import { addToForm } from "../../utils/form-helper";
import { useNavigate } from "react-router-dom";

export default function Products() {

    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const navigate = useNavigate()
    const [opened, setOpened] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const [product, setProduct] = useState(null)



    useEffect(() => {

        fetchAllProducts()
        fetchAllCategories()
        fetchAllImages()
    }, [])

    const fetchAllCategories = async () => {

        const response = await fetch(baseUrl + 'categories?paginate=100&page=1',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )
        const resp = await response.json();
        if (resp.success) {
            setCategories(resp.data.data)
        }
        else {
            showNotificaiton('Error', 'Failed to fetch categories', 'error')
        }

    }

    const fetchAllImages = async () => {

        const response = await fetch(baseUrl + 'images?paginate=100&page=1',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )
        const resp = await response.json();
        if (resp.success) {
            setImages(resp.data.data)
        }
        else {
            showNotificaiton('Error', 'Failed to fetch images', 'error')
        }

    }

    const fetchAllProducts = async (page) => {
        setLoading(true)

        const response = await fetch(baseUrl + `products?paginate=20&page=${page}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setProducts(resp.data.data)
            setTotalPages(resp.data.last_page)
            setPage(resp.data.current_page)

        }
        else {
            showNotificaiton('Error', 'Failed to fetch products', 'error')
        }


        setLoading(false)
    }

    const deleteProduct = async (id) => {
        setDeleteLoading(true)

        const response = await fetch(baseUrl + `products/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setProduct(null);
            fetchAllProducts()
            showNotificaiton('Success', resp.message, 'success')
        }
        else {
            showNotificaiton('Error', 'Failed to fetch products', 'error')
        }
        setDeleteLoading(false)
    }

    const rows = products?.map((element) => (
        <Table.Tr className="cursor-pointer" onClick={() => { navigate(`/products/${encodeURIComponent(JSON.stringify(element))}`) }} key={element?.id}>
            <Table.Td>{element?.id}</Table.Td>
            <Table.Td>
                <Image className="h-10 object-cover" src={element?.images?.[0].path} />
            </Table.Td>
            <Table.Td>{element?.name}</Table.Td>
            <Table.Td><Text lineClamp={4}>{element?.description ?? '-'}</Text></Table.Td>
            <Table.Td>{element?.cost_price ?? '-'}</Table.Td>
            <Table.Td>{element?.selling_price ?? '-'}</Table.Td>
            <Table.Td>{element?.available_quantity ?? '-'}</Table.Td>
            <Table.Td>
                <Group>
                    <Button size="xs" color="blue" onClick={(e) => {
                        e.stopPropagation();
                        setProduct({ ...element }); setEditModalOpen(true);
                    }}>Edit</Button>
                    <Popover opened={opened && element.id === product.id} onChange={setOpened} width={300} trapFocus position="bottom" withArrow shadow="md" onClose={() => {
                        setProduct(null)
                    }}>
                        <Popover.Target>
                            <Button size="xs" color="red" onClick={(e) => {
                                e.stopPropagation();
                                setOpened(e => !e)
                                setProduct({ ...element })
                            }}>Delete</Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text size="lg" mb={"xs"}>Delete Product</Text>
                            <Text size="sm">Are you sure you want to delete this product?</Text>
                            <Group mt={"sm"}>
                                <Button size="xs" color="black" variant="outline" onClick={() => { }}>Cancel</Button>
                                <Button loading={deleteLoading} size="xs" color="black" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProduct(element?.id)
                                }}>Confirm</Button>
                            </Group>
                        </Popover.Dropdown>
                    </Popover>

                </Group>
            </Table.Td>

        </Table.Tr>
    ));

    return <>
        <Box className="flex justify-between">
            <Title order={3}>Products</Title>
            <Button onClick={() => { setProduct(null); setModalOpen(true) }} color="black">Add</Button>
        </Box>
        <Box className="flex gap-10 items-center my-5">
            <Pagination total={totalPages} value={page} onChange={fetchAllProducts} />
            {loading && <Loader size={30} />}
        </Box>
        <Box className="mt-6">
            <Table stickyHeader stickyHeaderOffset={60}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
                        <Table.Th>Image</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Cost Price</Table.Th>
                        <Table.Th>Selling Price</Table.Th>
                        <Table.Th>Available Quantity</Table.Th>
                        <Table.Th>Actions</Table.Th>

                    </Table.Tr>
                </Table.Thead>
                {loading && products.length <= 0 ? <Table.Tbody>
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

        {modalOpen && <AddEditProduct onImageUpload={() => { fetchAllImages() }} images={images} categories={categories} key={"Add"} onSucces={() => { fetchAllProducts(); setModalOpen(false); setProduct(null) }} opened={modalOpen} onClose={() => { setModalOpen(false) }} type={'Add'} />}

        {product !== null && editModalOpen && <AddEditProduct onImageUpload={() => { fetchAllImages() }} images={images} categories={categories} key={'edit'} product={product} onSucces={() => { fetchAllProducts(); setModalOpen(false); setProduct(null) }} opened={editModalOpen} onClose={() => { setEditModalOpen(false) }} type={'Edit'} />}
    </>
}

const AddEditProduct = ({ opened, onClose, product, type, categories, images, onImageUpload, onSucces }) => {
    const [loading, setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    console.log('Product ', product)

    const form = useForm({
        initialValues: {
            name: product?.name ?? '',
            description: product?.description ?? '',
            cost_price: product?.cost_price ?? 0,
            selling_price: product?.selling_price ?? 0,
            available_quantity: product?.available_quantity ?? 0,
            images: product?.images?.map(item => item.id.toString()) ?? [],
            categories: product?.categories[0].id.toString() ?? "",
            is_active: 1,


        },

        validate: {
            name: (value) => value === '' ? 'Name  is required' : null,
            description: (value) => value === '' ? 'Description  is required' : null,
            cost_price: (value) => value === '' ? 'Cost Price  is required' : null,
            selling_price: (value) => value === '' ? 'Selling Price  is required' : null,
            available_quantity: (value) => value === '' ? 'Available quantity  is required' : null,
            images: (value) => value.length <= 0 ? 'Atleast one image  is required' : null,
            categories: (value) => value === '' || value === null ? 'Category  is required' : null,
        },
    })


    const uploadImage = async (file) => {
        setImageLoading(true)

        var formData = new FormData();
        formData.append('file', file)

        const response = await fetch(baseUrl + `images`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })

        const resp = await response.json()
        if (resp.success) {
            onImageUpload()
            showNotificaiton('Success', 'Image uploaded successfully')
        } else {
            showNotificaiton('Error', 'Image upload failed', 'error')
        }


        setImageLoading(false)
    }


    const addProduct = async (values) => {
        setLoading(true)
        const response = await fetch(baseUrl + 'products', {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })
        const resp = await response.json()
        if (resp.success) {
            onSucces()
            showNotificaiton('Success', 'Product added successfully')
        } else {
            showNotificaiton('Error', 'Product add failed', 'error')
        }
        setLoading(false)
    }

    const editProduct = async (values) => {
        setLoading(true)
        const response = await fetch(baseUrl + `products/${product?.id}`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })
        const resp = await response.json()
        if (resp.success) {
            onSucces()
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
    }} title={`${type} Products`}>
        <form onSubmit={form.onSubmit((values) => {
            if (type === 'Edit' && product !== null) {
                editProduct(values)
            } else {
                addProduct(values)
            }
        })}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Product Name"
                disabled={loading}
                {...form.getInputProps('name')}
            />
            <Textarea
                className="mt-5"
                withAsterisk
                label="Description"
                disabled={loading}
                placeholder="Write something about the product"

                {...form.getInputProps('description')}
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
                label="Available Quantity"
                placeholder="Product available quantity"
                disabled={loading}
                {...form.getInputProps('available_quantity')}
            />
            <Select
                className="mt-5"
                label="Category"
                placeholder="Pick product category"
                data={categories.map((item) => ({ value: item.id.toString(), label: item.name }))}
                disabled={loading}
                clearable
                {...form.getInputProps('categories')}
            />
            <Box className="flex items-end gap-3">
                <MultiSelect
                    className="mt-5 flex-1"
                    label="Images"
                    placeholder="Pick product images"
                    data={images.map((item) => item.id.toString())}
                    renderOption={({ option, checked }) => {
                        return <Box display={'flex'} className={`gap-4 p-2 ${checked ? 'bg-gray-200' : 'white'}`}>
                            <Image h={55} w={55} fit="cover" src={images.find(item => item.id.toString() === option.value).path} />
                            <div>
                                <Text size="sm">{images.find(item => item.id.toString() === option.value).id}</Text>
                                <Text size="xs" opacity={0.5}>
                                    {images.find(item => item.id.toString() === option.value).path}
                                </Text>
                            </div>
                        </Box>
                    }}
                    maxDropdownHeight={300}
                    disabled={loading}
                    clearable
                    {...form.getInputProps('images')}
                />
                {/* <Button>Add Image</Button> */}
                <FileButton onChange={(file) => { uploadImage(file) }} accept="image/png,image/jpeg">
                    {(props) => <Button loading={imageLoading} color="black" {...props}>Add image</Button>}
                </FileButton>
                {/* <FileInput className="overflow-hidden max-w-[30%]" type="button" placeholder="Add Image" accept="image/png,image/jpeg" /> */}
            </Box>
            <Button loading={loading} className="mt-5" color="black" type="submit">{type}</Button>
        </form>
    </Modal>
}