import { BackgroundImage, Box, Grid, Loader, Pagination, Skeleton, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { ItemCard } from "../../components/products/ItemCard";
import { baseUrl } from "../../utils/baseUrl";
import { showNotificaiton } from "../../utils/notifications";

export default function Drops({ type = "MEN" }) {



    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [products, setProducts] = useState([])


    useEffect(() => {
        fetchProductsByCategory(1)
    }, [type])

    const getCatId = useMemo(() => {
        switch (type.toLowerCase()) {
            case 'men':
                return 1
            case 'women':
                return 2;
            case 'slippers':
                return 3
            default:
                return 5
        }
    }, [type])


    const fetchProductsByCategory = async (page, colors = null, sizes = null) => {


        setLoading(true)
        const cat = getCatId
        const response = await fetch(baseUrl + `products?paginate=20&page=${page}&categories=${cat}`,
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