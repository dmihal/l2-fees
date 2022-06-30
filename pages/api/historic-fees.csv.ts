import { NextApiRequest, NextApiResponse } from 'next';


function getQuery(skip) {
  return `{
    dayStats(first: 100, skip: ${skip}) {
      date
      averageCostETH
      averageCostUSD
    }
  }`
}

async function subgraphQuery(id, skip = 0) {
  const query = getQuery(skip)
  const req = await fetch(`https://api.thegraph.com/subgraphs/name/${id}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query })
  })
  const json = await req.json()
  let result = json.data.dayStats
  if (result.length === 100) {
    result = [...result, ...(await subgraphQuery(id, skip + 100))]
  }
  return result;
}

async function loadData() {
  const [ethereumData, arbitrumData, optimismData] = await Promise.all([
    subgraphQuery('dmihal/ethereum-average-fees'),
    subgraphQuery('dmihal/arbitrum-average-fees'),
    subgraphQuery('dmihal/optimism-average-fees'),
  ])

  const data = []
  let arb = 0;
  let opt = 0;
  let eth = 100;

  while (arb < arbitrumData.length && opt < optimismData.length) {
    const ethDay = ethereumData[eth]
    const arbDay = arbitrumData[arb]
    const optDay = optimismData[opt]
    const day: any = {
      date: parseInt(arbDay.date),
      ethereum: parseFloat(ethDay.averageCostUSD),
    }
    if (ethDay.date === arbDay.date) {
      day.arbitrum = parseFloat(arbDay.averageCostUSD)
      arb++;
    }
    if (ethDay.date === optDay.date) {
      day.optimism = parseFloat(optDay.averageCostUSD)
      opt++;
    }
    data.push(day)
    eth++;
  }
  return data;
}

const pad = (num: number) => num < 10 ? `0${num}` : num.toString()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await loadData();

  let csv = 'Date,Arbitrum,Optimism,Ethereum\n';
  for (const day of data) {
    const date = new Date(day.date * 1000)
    csv += `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())},${day.arbitrum || ''},${day.optimism || ''},${day.ethereum}\n`
  }

  res.setHeader('Content-type', 'text/csv');
  res.end(csv);
};

export default handler;
