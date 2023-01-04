import React from 'react';
import Attribute from './Attribute';
import Button from './Button';
import l2BeatSVG from 'icons/l2beat.svg';
import BundleItemRow from './BundleItemRow';

interface DetailsCardProps {
  protocol: any;
}

const L2BeatIcon: React.FC = () => (
  <div className="l2Beat">
    <style jsx>{`
      .l2Beat {
        background: url('${l2BeatSVG}');
        background-size: contain;
        height: 18px;
        width: 18px;
        margin-right: 2px;
        flex: 0 0 18px;
      }
    `}</style>
  </div>
);

const DetailsCard: React.FC<DetailsCardProps> = ({ protocol }) => {
  return (
    <div className="details-card">
      {protocol.children && (
        <div>
          {protocol.children
            .sort((a: any, b: any) => b.result - a.result)
            .map((bundleItem: any) => (
              <BundleItemRow item={bundleItem} key={bundleItem.id} />
            ))}
        </div>
      )}

      <div className="metadata">
        {protocol.metadata.description && (
          <div className="description">{protocol.metadata.description}</div>
        )}

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

        {protocol.metadata.l2BeatSlug && (
          <div>
            <Button
              href={`https://l2beat.com/scaling/projects/${protocol.metadata.l2BeatSlug}/`}
              Icon={L2BeatIcon}
            >
              More Details at L2Beat.com
            </Button>
          </div>
        )}
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
