import { AreaChart, DonutChart } from '@mantine/charts';
import { Box, Grid, Table, Title } from '@mantine/core';

export default function Dashboard() {

    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];

    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
        </Table.Tr>
    ));

    return <Box>
        <Title mb={30}>Dashboard</Title>
        <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
                <AreaChart
                    className='shadow-md p-5'
                    h={300}
                    data={data}
                    dataKey="date"
                    series={[
                        { name: 'Apples', color: 'indigo.6' },
                        { name: 'Oranges', color: 'blue.6' },
                        { name: 'Tomatoes', color: 'teal.6' },
                    ]}
                    curveType="natural"
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} display={"flex"} className='p-5 flex justify-center items-center'>
                <Box className='shadow-md w-[100%] h-[100%]'>
                    <Box className='flex justify-center items-center'>
                        <DonutChart size={243} thickness={30} paddingAngle={6} data={data2} />
                    </Box>
                </Box>
            </Grid.Col>
        </Grid>
        <Box className='mt-10'>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Element position</Table.Th>
                        <Table.Th>Element name</Table.Th>
                        <Table.Th>Symbol</Table.Th>
                        <Table.Th>Atomic mass</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Box>
    </Box>
}

export const data2 = [
    { name: 'USA', value: 400, color: 'indigo.6' },
    { name: 'India', value: 300, color: 'yellow.6' },
    { name: 'Japan', value: 100, color: 'teal.6' },
    { name: 'Other', value: 200, color: 'gray.6' },
];

export const data = [
    {
        date: 'Mar 22',
        Apples: 2890,
        Oranges: 2338,
        Tomatoes: 2452,
    },
    {
        date: 'Mar 23',
        Apples: 2756,
        Oranges: 2103,
        Tomatoes: 2402,
    },
    {
        date: 'Mar 24',
        Apples: 3322,
        Oranges: 986,
        Tomatoes: 1821,
    },
    {
        date: 'Mar 25',
        Apples: 3470,
        Oranges: 2108,
        Tomatoes: 2809,
    },
    {
        date: 'Mar 26',
        Apples: 3129,
        Oranges: 1726,
        Tomatoes: 2290,
    },
];