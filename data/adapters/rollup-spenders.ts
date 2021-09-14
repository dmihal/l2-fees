import { Context } from '@cryptostats/sdk';

export function getRollupSpenders(sdk: Context, id: string) {
  const spenderQuery = async (date: string) => {
    const startOfDayBlock = await sdk.chainData.getBlockNumber(date);
    const endOfDayBlock = await sdk.chainData.getBlockNumber(sdk.date.offsetDaysFormatted(date, 1));

    const query = `query fees($id: String! $startOfDayBlock: Int!, $endOfDayBlock: Int!){
      startOfDay: ethspent(id: $id, block: {number: $startOfDayBlock}) {
        spent
      }
      endOfDay: ethspent(id: $id, block: {number: $endOfDayBlock}) {
        spent
      }
    }`;

    const data = await sdk.graph.query('dmihal/eth-spent-by-rollups', query, {
      variables: {
        id,
        startOfDayBlock,
        endOfDayBlock,
      },
    });

    return data.endOfDay.spent - data.startOfDay.spent;
  };

  return spenderQuery;
}
