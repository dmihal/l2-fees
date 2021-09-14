import { Context } from '@cryptostats/sdk';

export function getRollupSpenders(sdk: Context, id: string, usd?: boolean) {
  const attribute = usd ? 'spentUSD' : 'spent';

  const spenderQuery = async (date: string) => {
    const startOfDayBlock = await sdk.chainData.getBlockNumber(date);
    const endOfDayBlock = await sdk.chainData.getBlockNumber(sdk.date.offsetDaysFormatted(date, 1));

    const query = `query fees($id: String! $startOfDayBlock: Int!, $endOfDayBlock: Int!){
      startOfDay: ethspent(id: $id, block: {number: $startOfDayBlock}) {
        ${attribute}
      }
      endOfDay: ethspent(id: $id, block: {number: $endOfDayBlock}) {
        ${attribute}
      }
    }`;

    const data = await sdk.graph.query('dmihal/eth-spent-by-rollups', query, {
      variables: {
        id,
        startOfDayBlock,
        endOfDayBlock,
      },
    });

    return data.endOfDay[attribute] - data.startOfDay[attribute];
  };

  return spenderQuery;
}
