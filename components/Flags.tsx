import React from 'react';
import { Info } from 'react-feather';
import speedometer from './icons/speedometer.svg';

const SpeedometerIcon: React.FC = () => (
  <div className="speedometer">
    <style jsx>{`
      .speedometer {
        background: url('${speedometer}');
        height: 18px;
        width: 18px;
        margin-right: 2px;
        flex: 0 0 18px;
      }
    `}</style>
  </div>
);

const icons: { [id: string]: React.ComponentType } = {
  throtle: SpeedometerIcon,
  info: Info,
}

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
  )
}

export default Flags;
