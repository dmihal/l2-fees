import React from 'react';

interface ToggleBarProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (newSelection: string) => void;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ options, selected, onChange }) => {
  return (
    <ul>
      {options.map(option => (
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
        }

        li {}

        li.selected {
          background: white;
        }
      `}</style>
    </ul>
  )
}

export default ToggleBar;
