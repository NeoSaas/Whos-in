import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Updated import
import { FacebookShareButton, TwitterShareButton } from 'react-share'; // Install with: npm install react-share

interface EventExportButtonProps {
  eventId: string;
}

export function EventExportButton({ eventId }: EventExportButtonProps) {
  const [showQR, setShowQR] = useState(false);
  const eventUrl = `${window.location.origin}/event/${eventId}`;

  return (
    <div className="export-buttons">
      <button onClick={() => navigator.clipboard.writeText(eventUrl)}>
        Copy Event Link
      </button>

      <button onClick={() => setShowQR(!showQR)}>
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </button>

      {showQR && (
        <div className="qr-code">
          <QRCodeSVG value={eventUrl} />
        </div>
      )}

      <FacebookShareButton url={eventUrl}>
        <button>Share on Facebook</button>
      </FacebookShareButton>

      <TwitterShareButton url={eventUrl}>
        <button>Share on Twitter</button>
      </TwitterShareButton>
    </div>
  );
} 