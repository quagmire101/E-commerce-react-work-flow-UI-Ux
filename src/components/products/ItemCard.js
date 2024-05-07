import { Box, Image, Pill, Rating, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router";

export const ItemCard = ({ item, height = '100%' }) => {

    const navigate = useNavigate();


    return <Box h={height} onClick={() => { navigate(`/product/${item.id}`) }} className="cursor-pointer group w-full relative overflow-hidden shadow h-full" >
        <Image className="group-hover:scale-125 transition duration-500 h-full" src={item?.images?.[0]?.path} />
        <Box className="absolute p-3 top-0 left-0 h-full  w-full bg-gradient-to-t from-[#00000090] flex flex-col-reverse items-start">
            <Box className="flex flex-col gap-2">

                <Title order={3} className="text-white">{item?.name}</Title>
                <Box display={"flex"} className="gap-2">
                    <Pill style={{ alignSelf: 'start' }}>{item?.categories?.[0].name}</Pill>
                </Box>

                <Rating defaultValue={2} readOnly />
                <Text c={'#ffffff'} w={'full'} lineClamp={2}>{item?.description}</Text>
                <Title order={3} className="text-white">Rs. {item?.selling_price}</Title>
            </Box>
        </Box>
    </Box>
}