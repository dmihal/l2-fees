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
  percent: boolean;
  formatPercent?: boolean;
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

const usdFormatter = (num: number) => '$' + Math.floor(num / 1000) + (num > 0 ? 'k' : '');
const percentFormatter = (decimal: number) =>
  decimal.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 1 });

const L1Chart: React.FC<SeriesChartProps> = ({ data, percent, formatPercent }) => {
  const server = false;
  const Container: any = server ? 'div' : ResponsiveContainer;

  const margin = server
    ? { top: 20, right: 20, bottom: 20, left: 20 }
    : { top: 0, right: 10, bottom: 6, left: 0 };

  const width = server ? 380 : 500;
  const keysInOrder = Object.entries(data[data.length - 1])
    .sort(([, val1], [, val2]) => (val2 as number) - (val1 as number))
    .map(([key]) => key);

  const yFormatter = formatPercent ? percentFormatter : usdFormatter;
  const tooltipFormatter = formatPercent && !percent ? percentFormatter : usdFormatter;

  return (
    <Container height={300}>
      <AreaChart
        height={300}
        width={width}
        margin={margin}
        barCategoryGap={1}
        data={data}
        stackOffset={percent ? 'expand' : undefined}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={yFormatter} />
        <Tooltip formatter={tooltipFormatter} />

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
