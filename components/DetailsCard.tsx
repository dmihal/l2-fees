import React from 'react';
import Link from 'next/link';
import Attribute from './Attribute';
import Button from './Button';

interface DetailsCardProps {
  protocol: any;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ protocol }) => {
  return (
    <div className="details-card">
      <div className="metadata">
        {protocol.metadata.description && <div className="description">{protocol.metadata.description}</div>}

        <div className="row">
          {protocol.metadata.website && (
            <Attribute title="Website">
              <a href={protocol.metadata.website} target="website">
                {protocol.metadata.website.replace('https://', '')}
              </a>
            </Attribute>
          )}
        </div>

        <div className="spacer" />

        <div>
          <Link href={`/protocol/${protocol.id}`} passHref>
            <Button>More Details</Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .details-card {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .metadata {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .description {
          margin: 4px 0;
        }
        .row {
          display: flex;
        }
        .row > :global(div) {
          flex: 1;
        }
        .spacer {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default DetailsCard;
