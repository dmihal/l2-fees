import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';

interface ToggleBarProps {
  options: { path: string; label: string }[];
}

const ToggleBar: React.FC<ToggleBarProps> = ({ options }) => {
  const router = useRouter();

  return (
    <ul className="bar">
      {options.map((option) => (
        <li key={option.path} className={option.path === router.pathname ? 'selected' : ''}>
          {option.path === router.pathname ? (
            option.label
          ) : (
            <Link href={option.path}>
              <a>{option.label}</a>
            </Link>
          )}
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

        a {
          color: #b0b4bf;
          text-decoration: none;
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

        li.selected,
        li.selected {
          background: white;
          color: #091636;
        }
      `}</style>
    </ul>
  );
};

export default ToggleBar;
