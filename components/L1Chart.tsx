import React from 'react';
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SeriesChartProps {
  data: any[];
}

const protocols: { [id: string]: { name: string; color: string } } = {
  'arbitrum-one': {
    name: 'Arbitrum One',
    color: '#28a0ef',
  },
  aztec: {
    name: 'Aztec',
    color: '#adacfa',
  },
  dydx: {
    name: 'dYdX',
    color: '#6765fc',
  },
  hermez: {
    name: 'Hermez',
    color: '#e65a2c',
  },
  'immutable-x': {
    name: 'Immutable X',
    color: '#16b4cb',
  },
  loopring: {
    name: 'Loopring',
    color: '#1c60ff',
  },
  metis: {
    name: 'Metis',
    color: '#00dacc',
  },
  optimism: {
    name: 'Optimism',
    color: '#fe0000',
  },
  'zk-sync': {
    name: 'ZKSync',
    color: '#4e529a',
  },
};

const toDollars = (num: number) => '$' + Number(num.toFixed(0)).toLocaleString();

const L1Chart: React.FC<SeriesChartProps> = ({ data }) => {
  const server = false;
  const Container: any = server ? 'div' : ResponsiveContainer;

  const margin = server
    ? { top: 20, right: 20, bottom: 20, left: 20 }
    : { top: 0, right: 10, bottom: 6, left: 0 };

  const width = server ? 380 : 500;
  const keysInOrder = Object.entries(data[data.length - 1])
    .sort(([, val1], [, val2]) => (val2 as number) - (val1 as number))
    .map(([key]) => key);

  return (
    <Container height={200}>
      <AreaChart height={200} width={width} margin={margin} barCategoryGap={1} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={toDollars} />
        <Tooltip formatter={toDollars} />

        {keysInOrder.map((id) =>
          id === 'date' ? null : (
            <Area
              key={id}
              type="monotone"
              dataKey={id}
              stackId="1"
              stroke={protocols[id]?.color}
              fill={protocols[id]?.color}
            />
          )
        )}
      </AreaChart>
    </Container>
  );
};

export default L1Chart;
