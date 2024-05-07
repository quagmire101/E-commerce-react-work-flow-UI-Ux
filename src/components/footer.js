import { Box, Grid, List, Text, Title } from "@mantine/core"
import Logo from '../assets/svg/logo-white.svg'
import { IconAddressBook, IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandWhatsapp, IconMail, IconUser, IconWebhook } from "@tabler/icons"

export const Footer = () => {

    return <Box className="mt-5 w-full bg-black text-white p-5 py-12">
        <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Box className="px-5">
                    <Title order={3}>STRIDE</Title>
                    <Text mt={10}>Our universe is bound by rules. It is full of conformity and obedience. Stars, Planets, Moons - all following the same motions, time after time. A universe of monotony. But, very often, something comes along to disrupt all this dull and repetitive harmony - a Comet. It sets off on its path - focused, unstoppable. And most importantly, hard to ignore. </Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Title order={3}>NEED HELP?</Title>
                <List size="lg" mt={10}>
                    <List.Item><Text size="lg" className="hover:underline cursor-pointer">HOME</Text></List.Item>
                    <List.Item><Text size="lg" className="hover:underline cursor-pointer">CONTACT</Text></List.Item>
                    <List.Item><Text size="lg" className="hover:underline cursor-pointer">MEN</Text></List.Item>
                    <List.Item><Text size="lg" className="hover:underline cursor-pointer">WOMEN</Text></List.Item>
                </List>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Title order={3}>CONNECT </Title>
                <List size="lg" mt={10}>
                    <List.Item icon={<IconBrandFacebook />}><Text size="lg" className="hover:underline cursor-pointer">FACEBOOK</Text></List.Item>
                    <List.Item icon={<IconBrandInstagram />}><Text size="lg" className="hover:underline cursor-pointer">INSTAGRAM</Text></List.Item>
                    <List.Item icon={<IconBrandWhatsapp />}><Text size="lg" className="hover:underline cursor-pointer">WHATSAPP</Text></List.Item>
                    <List.Item icon={<IconBrandLinkedin />}><Text size="lg" className="hover:underline cursor-pointer">LINKEDIN</Text></List.Item>
                </List>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Title order={3}>CONTACT US</Title>
                <List size="lg" mt={10}>
                    <List.Item icon={<IconUser />}>AMAN</List.Item>
                    <List.Item icon={<IconMail />}><Text size="lg" className="hover:underline cursor-pointer">INFO@AMAN.COM</Text></List.Item>
                    <List.Item icon={<IconWebhook />}><Text size="lg" className="hover:underline cursor-pointer">STRIDE.COM/CONTACT</Text></List.Item>
                    <List.Item icon={<IconAddressBook />}>POKHARA</List.Item>
                </List>


            </Grid.Col>
        </Grid>
    </Box>
}