import { Carousel, CarouselSlide } from "@mantine/carousel"
import { Avatar, Box, Grid, Image, Pill, Rating, Text, Title } from "@mantine/core"

export const Review = () => {


    return <>

        <Title mb={15}>What are they saying?</Title>

        <Carousel
            height={300}
            slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
            slideGap={{ base: 0, sm: 'sm' }}
            loop
            align="start"
        >
            {Array(10).fill(10).map((_, index) => {
                return <CarouselSlide key={index}>
                    <Box className=" group w-full relative overflow-hidden h-full p-1" >
                        <Box className="p-3 shadow border h-full">
                            <Box className="flex flex-col justify-between h-full">
                                <Box>
                                    <Title order={4} mb={4}>TOTALLY LOVED THESE SHOES!</Title>
                                    <Text size="lg" w={'full'} lineClamp={4}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde provident eos fugiat id
                                        necessitatibus magni ducimus molestias. Placeat, consequatur.</Text>
                                </Box>
                                <Box className="flex justify-between items-center">
                                    <Box className="flex items-center gap-3">
                                        <Avatar size={"lg"} src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="it's me" />
                                        <Text size="lg">Aman</Text>
                                    </Box>
                                    <Rating size={"xl"} defaultValue={2} readOnly />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </CarouselSlide>
            })}
        </Carousel>
    </>
}