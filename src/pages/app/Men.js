import { BackgroundImage, Box, Text, Title, Grid, Collapse, Skeleton, Pagination, Loader, Button, Group } from "@mantine/core";
import { ItemCard } from "../../components/products/ItemCard";
import { BsFillFilterCircleFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import { showNotificaiton } from "../../utils/notifications";

export default function Men({ type = "MEN" }) {

    const [openFilter, setOpenFilter] = useState(false)

    const hexColors = [
        "#FF5733",
        "#1F618D",
        "#27AE60",
        "#F39C12",
        "#8E44AD",
        "#E74C3C",
        "#2C3E50",
        "#16A085",
        "#D35400",
        "#3498DB"
    ];

    const [selectedColors, setSelectedColors] = useState([])
    const [selectedSizes, setSelectedSizes] = useState([])

    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [products, setProducts] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])


    useEffect(() => {
        setSelectedColors([]); setSelectedSizes([]);
        fetchColors();
        fetchSizes();
        fetchProductsByCategory(1)
    }, [type])

    const fetchColors = async () => {
        const response = await fetch(baseUrl + `colors`,
            {
                method: 'GET'
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
                method: 'GET'
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

    const getCatId = useMemo(() => {
        switch (type.toLowerCase()) {
            case 'men':
                return 1
            case 'women':
                return 2;
            case 'Accessories':
                return 3
            default:
                return 3
        }
    }, [type])


    const fetchProductsByCategory = async (page, colors = null, sizes = null) => {
        let selColors = ''
        let selSizes = ''
        if (colors && colors?.length > 0) {
            selColors = '&colors[]=' + colors.join('&colors[]=')
        }
        if (sizes && sizes?.length > 0) {
            selSizes = '&sizes[]=' + sizes.join('&sizes[]=')
        }

        setLoading(true)
        const cat = getCatId
        const response = await fetch(baseUrl + `products?paginate=20&page=${page}&categories=${cat}${selColors}${selSizes}`,
            {
                method: 'GET'
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





    return <Box>
        <BackgroundImage h={'40vh'} src="https://images.pexels.com/photos/1261005/pexels-photo-1261005.jpeg">
            <Box className="h-full  w-full bg-gradient-to-t from-[#00000090] flex justify-center items-center">
                <Box className="text-center  h-full flex flex-col justify-end pb-10">
                    <Title className="text-white">SHOP FOR {type}</Title>
                    {type !== 'SLIPPERS' && <Text c={"white"}>STYLISH FOOTWEAR  FOR THE {type} OF TODAY</Text>}
                </Box>
            </Box>
        </BackgroundImage>
        <Box className="my-4 px-10">
            <Box className="mb-5">
                <Box onClick={() => { setOpenFilter((prev) => !prev) }} className="cursor-pointer flex gap-2 items-center mb-3">
                    <BsFillFilterCircleFill size={25} />
                    <Title order={3}>FILTER</Title>
                </Box>
                <Collapse in={openFilter}>
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Title order={4}>Color</Title>
                            <Box className="flex flex-wrap gap-1 mt-2">
                                {colors.map((item, index) => {
                                    return <Box onClick={() => {
                                        let temp = [...selectedColors];

                                        if (selectedColors.indexOf(item.id) !== -1) {
                                            temp.splice(temp.indexOf(item.id), 1);
                                        } else {
                                            temp = [...temp, item.id]
                                        }
                                        setSelectedColors(temp)
                                    }} key={index} bg={item.code} className={`h-[40px] w-[40px] rounded-full cursor-pointer border`}>
                                        {selectedColors.indexOf(item.id) !== -1 && <Box className="h-full w-full bg-[#00000070] rounded-full flex justify-center items-center">
                                            <FaCheck color="white" />
                                        </Box>}
                                    </Box>
                                })}
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Title order={4}>Size</Title>
                            <Box className="flex flex-wrap gap-1 mt-2">
                                {sizes.map((item, index) => {
                                    return <Box onClick={() => {
                                        let temp = [...selectedSizes];

                                        if (selectedSizes.indexOf(item.id) !== -1) {
                                            temp.splice(temp.indexOf(item.id), 1);
                                        } else {
                                            temp = [...temp, item.id]
                                        }
                                        setSelectedSizes(temp)
                                    }} key={index} className={`${selectedSizes.indexOf(item.id) !== -1 ? 'text-white bg-black' : ''} h-[40px] w-[40px] rounded-full border flex justify-center items-center cursor-pointer`}>
                                        {item.code.split(' ')[1]}
                                    </Box>
                                })}
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Collapse>
                {(selectedColors.length !== 0 || selectedSizes.length !== 0) &&
                    <Group>
                        <Button variant="outline" onClick={() => { setSelectedColors([]); setSelectedSizes([]); fetchProductsByCategory(1) }} mt={"md"} color="black">Reset</Button>
                        <Button onClick={() => { fetchProductsByCategory(1, selectedColors, selectedSizes) }} mt={"md"} color="black">Search</Button>
                    </Group>
                }
            </Box>
            <Box className="flex gap-10 items-center my-5">
                <Pagination total={totalPages} value={page} onChange={(page) => { fetchProductsByCategory(page) }} />
                {loading && <Loader size={30} />}
            </Box>
            <Grid gutter={1}>
                {loading ? Array(10).fill(10).map((item, index) => {
                    return <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
                        <Skeleton className="h-full" animate h={250} w={'100%'} />
                    </Grid.Col>
                }) :
                    products.map((item, index) => {
                        return <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                            <ItemCard height={300} item={item} index={index} />
                        </Grid.Col>
                    })}
            </Grid>
        </Box>
    </Box>
}