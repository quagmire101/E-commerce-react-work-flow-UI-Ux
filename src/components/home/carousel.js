import { Carousel } from '@mantine/carousel';
import { Button, Image } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const data = [
    {
        image:
            'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg',
        title: 'Walk the path of success, one stylish step at a time.',
        classname: 'left-[2vw] top-[60vh]',
        button: 'Shop for men',
        color: 'blue',
        cat: 'men',
    },
    {
        image:
            'https://images.pexels.com/photos/1801279/pexels-photo-1801279.jpeg',
        title: 'Step into confidence, stride into greatness; your shoes define your journey.',
        classname: 'left-[2vw] top-[60vh]',
        button: 'Shop for women',
        color: 'pink',
        cat: 'women',
    },
    {
        image:
            'https://images.pexels.com/photos/847371/pexels-photo-847371.jpeg',
        title: 'Elevate your style, lift your spirit – it begins with the right pair of shoes.',
        classname: 'left-[2vw] top-[60vh]',
        button: 'Shop for men',
        color: 'blue',
        cat: 'men',
    },
    {
        image:
            'https://images.pexels.com/photos/1261005/pexels-photo-1261005.jpeg',
        title: 'Upgrade your footwear, upgrade your attitude – because every step matters.',
        classname: 'left-[2vw] top-[60vh]',
        button: 'Shop for women',
        color: 'pink',
        cat: 'women',
    },
];

export const CarouselUI = () => {

    const navigate = useNavigate()

    const autoplay = useRef(Autoplay({ delay: 1500 }));



    const slides = data.map((item) => (
        <Carousel.Slide key={item.image}>
            <div className='relative h-full'>
                <Image className='h-full' src={item.image} />
                <div className={`absolute ${item.classname}  bg-[#00000040] p-8`}>
                    <p className='text-xl text-white italic text-bold'>{item.title}</p>
                    <Button onClick={() => { navigate(`/${item.cat}`) }} className='mt-4' color={item.color}>{item.button}</Button>
                </div>
            </div>
        </Carousel.Slide>
    ));

    return <Carousel withIndicators
        height={'90vh'}
        slideSize={{ base: '100%' }}
        loop
        align="start"
        withControls={false}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
    >{slides}</Carousel>;
}