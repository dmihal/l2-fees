import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

interface AverageFeeChartProps {
  data: {
    date: number
    [protocol: string]: number
  }[]
}

const toNiceDate = (timestamp: number, year?: boolean) => {
  return (new Date(timestamp * 1000)).toLocaleString([], {
    month: 'long',
    day: 'numeric',
    year: year ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

function getColorFromStr(stringInput: string) {
  const stringUniqueHash = Array.from(stringInput).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

const AverageFeeChart: React.FC<AverageFeeChartProps> = ({ data }) => {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          width={500}
          height={300}
          data={data}
          barCategoryGap={1}
          barGap={0}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(timestamp: number) => toNiceDate(timestamp)}
          />
          <YAxis scale="log" domain={['auto', 'auto']} />
          <Tooltip
            labelFormatter={(timestamp: number) => toNiceDate(timestamp)}
            formatter={(val: number) => '$' + val.toFixed(2)}
          />
          <Legend />
          {Object.keys(data[data.length - 1]).map(key => key !== 'date' && (
            <Bar key={key} dataKey={key} fill={getColorFromStr(key)} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <style jsx>{`
        .chart {
          max-width: 600px;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default AverageFeeChart;
