import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import path from 'path';
import SocialCard from 'components/SocialCard';
import sdk from 'data/sdk';

// These statements causes Next to bundle these files
path.resolve(process.cwd(), 'fonts', 'fonts.conf');
path.resolve(process.cwd(), 'fonts', 'SofiaProRegular.ttf');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const list = sdk.getCollection('l2-fees');
  await list.fetchAdapters();

  const data = await list.executeQueriesWithMetadata(['feeTransferEth'], {
    allowMissingQuery: true,
  });

  const filteredData = data.filter((val: any) => !!val && val.results.feeTransferEth);

  const svg = ReactDOMServer.renderToString(
    React.createElement(SocialCard, {
      data: filteredData,
      date: sdk.date.formatDate(new Date()),
    })
  );

  const buffer = Buffer.from(svg);
  const output = await sharp(buffer, { density: 300 }).toFormat('png').toBuffer();

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=240');
  res.setHeader('Content-Type', 'image/png');
  res.write(output, 'binary');
  res.end(null, 'binary');
};

export default handler;
