import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div>Data updates continuously</div>

      <div>
        Powered by <a href="https://cryptostats.community">CryptoStats</a>
      </div>

      <div>
        <a href="https://forum.cryptostats.community">Request Project</a>
        {' | '}
        <a href="https://t.me/+VNTjwOvI-W40Y2E5">Join our Telegram</a>
        {' | '}
        <a href="https://github.com/dmihal/l2-fees">GitHub</a>
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
        <a href="https://openorgs.info">openorgs.info</a>
      </div>
      <style jsx>{`
        footer {
          text-align: center;
          padding-top: 2rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
