import { Image, Box, Grid, Title, Button } from '@mantine/core'
import MenShoes from '../../assets/images/men-shoes.png'
import WomenShoes from '../../assets/images/women-shoes.png'
import Slippers from '../../assets/images/slippers.png'
import { useNavigate } from 'react-router-dom'

export const ShopBrands = () => {

    const navigate = useNavigate()

    return (
        <>
            <Grid align='stretch' gutter={0}>
                <Grid.Col span={12}>
                    <Box className='group h-[100%] w-[100%] flex flex-col justify-center items-center gap-4' style={{ background: 'linear-gradient(to left, #F6F5F2, #C7C8CC)' }}>
                        <Title order={1} className='text-white'>Mens shoe wear</Title>
                        <Button onClick={() => { navigate('/men') }} bg={'yellow'} c={'white'} mb={10}>Shop now</Button>
                        <Image className='group-hover:scale-125 group-hover:-rotate-[5deg] transition duration-500' h={'30rem'} w={'30rem'} fit='contain' src={MenShoes} alt='man shoes' />
                    </Box>
                </Grid.Col>
            </Grid>
    
            <Grid align='stretch' gutter={0}>
                <Grid.Col span={12}>
                    <Box className='group h-auto md:h-[80vh] w-[100%] bg-white flex flex-col md:flex-row justify-between items-center px-3 overflow-hidden'>
                        <Box className='justicy-center items-center flex flex-col gap-4'>
                            <Title order={1} className='text-black text-center'>Womens shoe wear</Title>
                            <Button onClick={() => { navigate('/women') }} bg={'Grey'} c={'white'} mb={10}>Shop now</Button>
                        </Box>
                        <Image className='group-hover:scale-125 group-hover:-rotate-[5deg] transition duration-500' h={'30rem'} w={'30rem'} fit='contain' src={WomenShoes} alt='man shoes' />
                    </Box>
                </Grid.Col>
            </Grid>
    
           
        </>
    );
}