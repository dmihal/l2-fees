import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div>Data updates continuously</div>
      <div>
        Created by{' '}
        <a href="https://twitter.com/dmihal" target="twitter">
          David Mihal
        </a>
      </div>

      <div>
        <b>l2fees.info</b>
        {' | '}
        <a href="https://cryptofees.info">cryptofees.info</a>
        {' | '}
        <a href="https://ethburned.info">ethburned.info</a>
        {' | '}
        <a href="https://money-movers.info">money-movers.info</a>
        {' | '}
        <a href="https://open-orgs.info">open-orgs.info</a>
      </div>
    </footer>
  );
};

export default Footer;
