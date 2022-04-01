import React from 'react';

interface ToggleBarProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (newSelection: string) => void;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ options, selected, onChange }) => {
  return (
    <ul className="bar">
      {options.map((option) => (
        <li
          key={option.value}
          className={option.value === selected ? 'selected' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </li>
      ))}

      <style jsx>{`
        .bar {
          display: flex;
          padding: 0;
        }
        li {
          padding: 6px;
          list-style: none;
          border: 1px solid #d0d1d9;
          border-right: none;
          background: transparent;
          font-size: 18px;
          color: #b0b4bf;
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
        }
      `}</style>
    </ul>
  );
};

export default ToggleBar;
