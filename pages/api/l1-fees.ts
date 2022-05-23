import sdk from 'data/sdk';
import { NextApiRequest, NextApiResponse } from 'next';


export function wrapHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  { allowedMethods }: { allowedMethods?: string[] } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      )
      if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
      }

      if (allowedMethods && allowedMethods.indexOf(req.method) === -1) {
        return res.status(400).json({ error: `Only ${allowedMethods.join(', ')} methods allowed`})
      }
      
      await handler(req, res)
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  }
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const collection = sdk.getCollection('rollup-l1-fees');
  await collection.fetchAdapters();

  const feesCollection = sdk.getCollection('fees');
  await feesCollection.fetchAdapters();
  const ethFeesAdapter = feesCollection.getAdapter('eth');
  
  let timeData = await Promise.all(
    (req.query.dates as string).split(',').map(async (date: string) => ({
      date,
      result: await collection.executeQuery('oneDayFeesPaidUSD', date),
      total: await ethFeesAdapter.executeQuery('oneDayTotalFees', date),
    }))
  );

  const l2Percent = [];

  timeData = timeData.map((oneDay) => {
    let l2total = 0;

    const transformedData = oneDay.result.reduce((map: any, result) => {
      l2total += result.result || 0;

      const id = result.bundle || result.id;
      map[id] = (map[id] || 0) + (result.result || 0);
      return map;
    }, {});

    l2Percent.push({
      date: oneDay.date,
      percent: l2total / oneDay.total,
    });

    return {
      date: oneDay.date,
      ...transformedData,
    };
  });

  res.json({ success: true, timeData, l2Percent });
};

export default wrapHandler(handler);
