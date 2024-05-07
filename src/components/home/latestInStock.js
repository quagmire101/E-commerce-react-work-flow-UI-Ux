import { Carousel, CarouselSlide } from "@mantine/carousel"
import { Box, Grid, Image, Pill, Rating, Skeleton, Text, Title } from "@mantine/core"
import { ItemCard } from "../products/ItemCard"
import { useEffect, useState } from "react"
import { baseUrl } from "../../utils/baseUrl"
import { showNotificaiton } from "../../utils/notifications"

export const LatestInStock = () => {

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchAllProducts(1)
    }, [])

    const fetchAllProducts = async (page) => {
        setLoading(true)

        const response = await fetch(baseUrl + `products?paginate=20&page=${page}`,
            { method: 'GET' }
        )

        const resp = await response.json();
        if (resp.success) {
            setProducts(resp.data.data)

        }
        else {
            showNotificaiton('Error', 'Failed to fetch products', 'error')
        }


        setLoading(false)
    }


    return <>

        <Title mb={10}>Latest in Stock</Title>

        <Carousel
            height={500}
            slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
            slideGap={{ base: 0, sm: 'sm' }}
            loop
            align="start"
        >
            {loading ? Array(10).fill(10).map((_, index) => {
                return <CarouselSlide key={index}>
                    <Skeleton h={'100%'} w={'100%'} animate />
                </CarouselSlide>
            }) :
                products.map((item, index) => {
                    return <CarouselSlide key={index}>
                        <ItemCard item={item} index={index} />
                    </CarouselSlide>
                })}
        </Carousel>
    </>
}