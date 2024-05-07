import { Box, Button, Group, Modal, Popover, Skeleton, Table, Text, TextInput, Textarea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import { showNotificaiton } from "../../utils/notifications";
import { useForm } from "@mantine/form";
import { addToForm } from "../../utils/form-helper";

export default function Categories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const [cat, setCat] = useState(null)


    useEffect(() => {

        fetchAllCategories()
    }, [])

    const fetchAllCategories = async () => {
        setLoading(true)

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


        setLoading(false)
    }

    const deleteCategory = async (id) => {
        setDeleteLoading(true)

        const response = await fetch(baseUrl + `categories/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setCat(null);
            fetchAllCategories()
            showNotificaiton('Success', resp.message, 'success')
        }
        else {
            showNotificaiton('Error', 'Failed to fetch categories', 'error')
        }


        setDeleteLoading(false)
    }



    const rows = categories?.map((element) => (
        <Table.Tr key={element?.id}>
            <Table.Td>{element?.id}</Table.Td>
            <Table.Td>{element?.name}</Table.Td>
            <Table.Td>{element?.description ?? '-'}</Table.Td>
            <Table.Td>{element?.products ?? '-'}</Table.Td>
            <Table.Td>
                <Group>
                    <Button size="xs" color="blue" onClick={() => { setCat({ ...element }); setEditModalOpen(true); }}>Edit</Button>
                    <Popover width={300} trapFocus position="bottom" withArrow shadow="md" onClose={() => { setCat(null) }}>
                        <Popover.Target>
                            <Button size="xs" color="red" onClick={() => {
                                setCat({ ...cat })
                            }}>Delete</Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text size="lg" mb={"xs"}>Delete Category</Text>
                            <Text size="sm">Are you sure you want to delete this category?</Text>
                            <Group mt={"sm"}>
                                <Button size="xs" color="black" variant="outline" onClick={() => { }}>Cancel</Button>
                                <Button loading={deleteLoading} size="xs" color="black" onClick={() => { deleteCategory(element?.id) }}>Confirm</Button>
                            </Group>
                        </Popover.Dropdown>
                    </Popover>

                </Group>
            </Table.Td>

        </Table.Tr>
    ));

    return <>
        <Box className="flex justify-between">
            <Title order={3}>Categories</Title>
            <Button onClick={() => { setCat(null); setModalOpen(true) }} color="black">Add</Button>
        </Box>
        <Box className="mt-6">
            <Table stickyHeader stickyHeaderOffset={60}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Products</Table.Th>
                        <Table.Th>Actions</Table.Th>

                    </Table.Tr>
                </Table.Thead>
                {loading && categories.length <= 0 ? <Table.Tbody>
                    {Array(8).fill(0).map((_, index) => {
                        return <Table.Tr key={index}>
                            {Array(5).fill(0).map((_, index) => {
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
        {modalOpen && <AddEditCategory key={"Add"} onSucces={() => { fetchAllCategories(); setModalOpen(false); setCat(null) }} opened={modalOpen} onClose={() => { setModalOpen(false) }} type={'Add'} />}

        {cat !== null && editModalOpen && <AddEditCategory key={'edit'} cat={cat} onSucces={() => { fetchAllCategories(); setModalOpen(false); setCat(null) }} opened={editModalOpen} onClose={() => { setEditModalOpen(false) }} type={'Edit'} />}
    </>
}

const AddEditCategory = ({ opened, onClose, type, onSucces, cat = null }) => {

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            name: cat?.name ?? '',
            description: cat?.description ?? ''
        },

        validate: {
            name: (value) => value === '' ? 'Name  is required' : null
        },
    })

    const categoryEdit = async (values) => {
        setLoading(true)

        const response = await fetch(baseUrl + `categories/${cat?.id}`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })

        const resp = await response.json()
        if (resp.success) {
            onSucces()
            showNotificaiton('Success', 'Category edited successfully')
        } else {
            showNotificaiton('Error', 'Category edit failed', 'error')
        }


        setLoading(false)
    }

    const categoryAdd = async (values) => {
        setLoading(true)

        const response = await fetch(baseUrl + 'categories', {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin-token')).token}`
            }
        })

        const resp = await response.json()
        if (resp.success) {
            onSucces()
            showNotificaiton('Success', 'Category added successfully')
        } else {
            showNotificaiton('Error', 'Category add failed', 'error')
        }


        setLoading(false)
    }

    return <Modal centered opened={opened} onClose={() => {
        if (!loading) {
            form.reset()
            onClose();
        }
    }} title={`${type} Category`}>
        <form onSubmit={form.onSubmit((values) => {
            if (type === 'Edit' && cat !== null) {
                categoryEdit(values)
            } else {
                categoryAdd(values)
            }
        })}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Cateogry Name"
                disabled={loading}
                {...form.getInputProps('name')}
            />
            <Textarea
                className="mt-5"
                withAsterisk
                label="Description"
                disabled={loading}
                placeholder="Write something about the category"

                {...form.getInputProps('description')}
            />
            <Button loading={loading} className="mt-5" color="black" type="submit">{type}</Button>
        </form>
    </Modal>
}