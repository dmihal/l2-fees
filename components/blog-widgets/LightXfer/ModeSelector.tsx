import React from 'react';

interface ModeSelectorProps {
  name: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  name,
  description,
  selected,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={`mode-selector ${selected ? ' selected' : ''} ${disabled ? ' disabled' : ''}`}
      onClick={disabled ? null : onClick}
    >
      <div>{name}</div>
      <div>{description}</div>

      <style jsx>{`
        .mode-selector {
          border: solid 1px gray;
          padding: 4px;
          margin: 2px;
          border: solid 2px transparent;
        }
        .mode-selector:hover {
          border: solid 2px white;
          cursor: pointer;
        }
        .selected,
        .selected:hover {
          border: solid 2px black;
        }
      `}</style>
    </div>
  );
};

export default ModeSelector;
