import { Box, Grid, Image, Text, Title } from "@mantine/core"

export const ShortAbout = () => {
    return <Grid gutter={{ base: 20, md: 0 }} align="stretch">
        <Grid.Col span={{ base: 12, md: 7 }} className=" flex flex-col justify-center">
            <Box className="pr-10">
                <Title mb={10}>About Us</Title>
                <Text size="xl">
                    Our universe is bound by rules. It is full of conformity and obedience. Stars, Planets, Moons - all following the same motions, time after time. A universe of monotony. But, very often, something comes along to disrupt all this dull and repetitive harmony - a Comet. It sets off on its path - focused, unstoppable. And most importantly, hard to ignore.
                    <br /><br />Why? Because it is out of the ordinary, a rule breaker on the grandest stage - fearless and unapologetic - in its path for liberation.
                </Text>
                <br />
                <Text size="xl" fw={600} c="dimmed">
                    Never wear old shoes.
                </Text>
                <br />
                {/* <Text size="xl" fw={600}>Read More {'>>'}</Text> */}
            </Box>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
            <Image h={{ base: 400, md: 'auto' }} src="https://www.wearcomet.com/cdn/shop/files/our-story-desktop_800x.gif?v=1689657733" />
        </Grid.Col>
    </Grid>
}