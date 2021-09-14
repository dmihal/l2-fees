import React from 'react';
import ReactGA from 'react-ga4';
import Link from 'next/link';

type Item = { value: string; label: string; href?: string };
type Option = Item | 'separator';

interface ToggleBarProps {
  options: Option[];
  selected: string;
  onChange: (newSelection: string) => void;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ options, selected, onChange }) => {
  const change = (id: string, label: string) => {
    ReactGA.event({
      category: 'Navigation',
      action: 'Change Tab',
      label: label,
    });
    onChange(id);
  };

  const sections: Item[][] = [[]];

  for (const option of options) {
    if (option === 'separator') {
      sections.push([]);
    } else {
      sections[sections.length - 1].push(option);
    }
  }

  return (
    <div className="bar">
      {sections.map((items: Item[], i: number) => (
        <ul key={i.toString()}>
          {items.map((option) => (
            <li
              key={option.value}
              className={option.value === selected ? 'selected' : ''}
              onClick={() => change(option.value, option.label)}
            >
              {option.href ? (
                <Link href={option.href}>
                  <a className="link">{option.label}</a>
                </Link>
              ) : (
                option.label
              )}
            </li>
          ))}
        </ul>
      ))}

      <style jsx>{`
        .bar {
          display: flex;
        }

        ul {
          display: flex;
          padding: 0;
          margin: 0 2px;
        }

        li {
          padding: 6px;
          list-style: none;
          border: 1px solid #d0d1d9;
          border-right: none;
          background: transparent;
          font-size: 18px;
          color: #b0b4bf;
          cursor: pointer;
        }
        li:hover {
          background: #eef1f6;
        }

        li:first-child {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        li:last-child {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
          border-right: 1px solid #d0d1d9;
        }

        li.selected {
          background: white;
          color: #091636;
          cursor: default;
        }

        .link {
          color: unset;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default ToggleBar;
