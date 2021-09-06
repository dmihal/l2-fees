import React from 'react';
import { Info } from 'react-feather';
import incognito from './icons/incognito.svg';
import speedometer from './icons/speedometer.svg';

const makeIcon = (image: string): React.FC => () => (
  <div className="icon">
    <style jsx>{`
      .icon {
        background: url('${image}');
        height: 18px;
        width: 18px;
        margin-right: 2px;
        flex: 0 0 18px;
        background-size: contain;
      }
    `}</style>
  </div>
);

const icons: { [id: string]: React.ComponentType<any> } = {
  throtle: makeIcon(speedometer),
  info: Info,
  private: makeIcon(incognito),
};

interface FlagsProps {
  flags: any;
}

const Flags: React.FC<FlagsProps> = ({ flags }) => {
  return (
    <div className="flags">
      {Object.entries(flags).map(([id, desc]: [string, string]) => {
        const Icon = icons[id];
        return (
          <div className="flag" key={id}>
            <Icon size={18} />
            <div className="tooltip">{desc}</div>
          </div>
        );
      })}
      <style jsx>{`
        .flags {
          padding: 4px;
        }
        .flag {
          position: relative;
        }
        .tooltip {
          width: 120px;
          display: none;
          background: black;
          position: absolute;
          color: white;
          font-size: 12px;
          text-align: center;
          padding: 5px 0;
          border-radius: 6px;
          white-space: normal;
          transform: translateX(-50%);
          z-index: 2;
        }
        .flag:hover .tooltip {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Flags;
