import { Carousel } from "@mantine/carousel"
import { ActionIcon, Box, Button, Grid, Pill, Popover, Rating, Text, TextInput, Textarea, Title } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import InnerImageZoom from "react-inner-image-zoom"
import { useParams } from "react-router"
import { baseUrl } from "../../utils/baseUrl"
import { AppContext } from "../../utils/context"
import { showNotificaiton } from "../../utils/notifications"
import { useCounter } from "@mantine/hooks"
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci"
import moment from "moment/moment"
import { useForm } from "@mantine/form"
import { addToForm } from "../../utils/form-helper"

export default function Product() {

    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState(null)

    const [reviewLoading, setReviewLoading] = useState(false)

    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [reviewPopover, setReviewPopover] = useState(false);

    const [count, handlers] = useCounter(1, { min: 1, max: product?.available_quantity ?? 10 })

    const { splashLoading, setSplashLoading, cart, setCart } = useContext(AppContext)


    const form = useForm({
        initialValues: {
            product_id: id,
            rating: 0,
            review: ""
        },
        validate: {
            review: (value) => value.length <= 0 ? 'Please write a review' : null,
        }
    })


    useEffect(() => {
        fetchProduct(id)
    }, [id])


    const fetchProduct = async (id) => {
        setSplashLoading(true)

        const response = await fetch(baseUrl + `products/${id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('user-token') !== null ? `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}` : null,
                    'Accept': 'application/json'
                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setProduct(resp.data)
            await fetchReview(resp.data.id)

        }
        else {
            showNotificaiton('Error', 'Failed to fetch product', 'error')
        }

        setSplashLoading(false)
    }

    const fetchReview = async (id) => {

        const response = await fetch(baseUrl + `reviews?product_id=${id}`,
            {
                method: 'GET',
                headers: {
                    'Accept': "application/json",

                }
            }
        )

        const resp = await response.json();
        if (resp.success) {
            setReviews(resp.data.data)

        }
    }

    const handleReviewSubmit = async (values) => {
        setReviewLoading(true)

        const response = await fetch(baseUrl + `reviews`, {
            method: 'POST',
            body: addToForm(values),
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-token')).token}`
            }
        })
        const resp = await response.json()
        if (resp.success) {
            form.reset()
            setReviewPopover(false)
            showNotificaiton('Success', 'Product edited successfully')
            await fetchReview(id)
        } else {
            showNotificaiton('Error', 'Product edit failed', 'error')
        }

        setReviewLoading(false)

    }


    return splashLoading ? <></> : <Box className="pt-5 xs:p-4 sm:p-6 lg:px-8">
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
                                src={item.path}
                                zoomSrc={item.path}
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
                    <Title order={1} >{product?.name}</Title>
                    <Box display={"flex"} className="gap-2">
                        <Pill style={{ alignSelf: 'start' }}>{product?.categories?.[0].name}</Pill>
                    </Box>
                    <Title order={1} >Rs. {(selectedColor && selectedSize) ? product.variants.find((item) => item.size_id === selectedSize && item.color_id === selectedColor).selling_price : product?.selling_price}</Title>

                    <Rating defaultValue={4} readOnly />
                    <Text w={'full'}>{product?.description}</Text>
                    {product?.categories?.[0]?.id !== 5 && <><Grid>
                        <Grid.Col span={{ base: 12 }}>
                            <Title order={4}>Color</Title>
                            <Box className="flex gap-1 mt-2">
                                {Object.values(product?.variants?.reduce((acc, obj) => {
                                    // Check if the color_id already exists in the accumulator object
                                    if (!acc[obj.color_id]) {
                                        // If it doesn't exist, add it to the accumulator with the current object
                                        acc[obj.color_id] = obj;
                                    }
                                    return acc;
                                }, {}) ?? {})?.map((item, index) => {
                                    return <Box onClick={() => { setSelectedColor(item.color_id); setSelectedSize(null) }} key={index} bg={item.color_code} className={`h-[40px] w-[40px] rounded-full cursor-pointer`}>
                                        {selectedColor === item.color_id && <Box className="h-full w-full bg-[#00000070] rounded-full flex justify-center items-center">
                                            <FaCheck color="white" />
                                        </Box>}
                                    </Box>
                                })}
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12 }}>
                            <Title order={4}>Size</Title>
                            {selectedColor === null ? <Text>Select color first:</Text> :
                                <Box className="flex gap-1 mt-2">
                                    {product?.variants?.filter(item => item.color_id === selectedColor).map((item, index) => {
                                        return <Box onClick={() => { setSelectedSize(item.size_id) }} key={index} className={`${selectedSize === item.size_id ? 'text-white bg-black' : ''} h-[40px] w-[40px] rounded-full border flex justify-center items-center cursor-pointer`}>
                                            {item.size.split(" ")[1]}
                                        </Box>
                                    })}
                                </Box>
                            }
                        </Grid.Col>
                    </Grid>
                        <Box className='flex gap-3 items-center my-3'>
                            <ActionIcon onClick={() => { handlers.decrement() }} radius={'xl'} variant="filled" aria-label="Settings">
                                <CiCircleMinus size={30} />
                            </ActionIcon>
                            <Text size='lg' fw={600}>{count}</Text>
                            <ActionIcon onClick={() => { handlers.increment() }} radius={'xl'} variant="filled" aria-label="Settings">
                                <CiCirclePlus size={30} />
                            </ActionIcon>
                        </Box>
                        <Button onClick={() => {
                            if (selectedColor !== null && selectedSize !== null) {
                                const prdIndex = cart.indexOf(item => item.id === product.id)
                                if (prdIndex !== -1) {
                                    var temp = [...cart]
                                    temp.splice(prdIndex, 1)
                                    setCart([...temp])
                                }

                                // let selectedSizeObj = product?.variants?.find((item) => item.size_id === selectedSize)
                                // let selectedColorObj = product?.variants?.find((item) => item.color_id === selectedColor)

                                let cartItem = {
                                    product,
                                    // price: product?.variants?.find((item) => item.size_id === selectedSize && item.color_id === selectedColor).selling_price,
                                    quantity: count,
                                    // size: { size_id: selectedSizeObj.size_id, size: selectedSizeObj.size },
                                    // color: { color_id: selectedColorObj.color_id, color: selectedColorObj.color_code },
                                    variant: product?.variants?.find((item) => item.size_id === selectedSize && item.color_id === selectedColor)
                                }

                                setCart((prev) => {
                                    localStorage.setItem('cart', JSON.stringify([...prev, cartItem]))
                                    return [...prev, cartItem]
                                }
                                )

                                setSelectedColor(null)
                                setSelectedSize(null)
                                handlers.set(1)



                                showNotificaiton('Success', 'Successfully added to cart', 'success')
                            } else {
                                showNotificaiton('Error', 'Select at least one color and size', 'error')
                            }
                        }} size={'xl'} bg={'black'} className=" mt-3">ADD TO CART</Button>
                    </>}
                </Box>
            </Grid.Col>
        </Grid>
        {product?.categories?.[0]?.id !== 5 && <Box className="mt-16 ">
            <Title>CUSTOMER REVIEW</Title>
            <Grid className="mt-5" align="center" gutter={50}>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Box className="flex flex-col gap-4 justify-center">
                        <Box className="flex gap-3 items-center">
                            <Rating size={'xl'} value={product?.ratings} readOnly />
                            <Text size="lg">{product?.ratings} out of 5</Text>
                        </Box>
                    </Box>
                </Grid.Col>
                {/* <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Box className="flex flex-col-reverse">
                        {[0, 5, 5, 1, 10].map((item, index) => {
                            return <Box key={index} className="flex gap-3 items-center justify-start md:justify-center">
                                <Rating size={'xl'} value={index + 1} readOnly />
                                <Text size="lg">{item}</Text>
                            </Box>
                        })}
                    </Box>

                </Grid.Col> */}
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }} >
                    <Box className="flex  md:justify-center">
                        {product?.can_review ?
                            <Popover width={500} opened={reviewPopover} onChange={setReviewPopover}>
                                <Popover.Target>
                                    <Button onClick={() => { setReviewPopover(true) }} bg={'black'} size={'xl'}>WRITE A REVIEW</Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <form onSubmit={form.onSubmit(handleReviewSubmit)}>
                                        <Box className="mb-3">
                                            <Text size="sm">Rating:</Text>
                                            <Rating readOnly={reviewLoading} value={form.values.rating} onChange={(val) => { form.setFieldValue('rating', val) }} />
                                        </Box>
                                        <Textarea
                                            className="mb-3"
                                            withAsterisk
                                            label="Review"
                                            placeholder="Descriptive review "
                                            disabled={reviewLoading}
                                            {...form.getInputProps('review')}
                                        />
                                        <Button loading={reviewLoading} bg={'black'} type="submit">
                                            Submit
                                        </Button>
                                    </form>
                                </Popover.Dropdown>
                            </Popover>

                            :
                            <Button bg={'black'} disabled size={'xl'}>YOU HAVE TO BUY TO WRITE REVIEW</Button>}
                    </Box>
                </Grid.Col>
            </Grid>
            <Box className="mt-10">
                {reviews?.map((item, index) => {

                    return <Box key={index} className="flex flex-col gap-4 border-y py-10">
                        <Rating size={'lg'} value={4} readOnly />
                        <Box>
                            <Title order={4}>{item?.user?.name}</Title>
                            <Text size="sm">{moment(item?.created_at).format('MMM DD, yyyy')}</Text>
                            <Text size="sm" c={'gray'}>{item?.user?.address ?? ''}</Text>
                        </Box>
                        <Box>
                            {/* <Title order={3}>Amazing Shoes</Title> */}
                            <Text>{item?.review}</Text>
                        </Box>
                    </Box>
                })}

            </Box>
        </Box>}
    </Box>
}