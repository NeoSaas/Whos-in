import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";

interface SocialShareImageProps {
  eventId: string;
  eventTitle: string;
  eventEmoji: string;
  eventDate: string;
  eventTime: string;
}

export function SocialShareImage({ eventId, eventTitle, eventEmoji, eventDate, eventTime }: SocialShareImageProps) {
  const [showModal, setShowModal] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  const eventUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/event/${eventId}`
    : `/event/${eventId}`;
  
  const handleGenerateImage = async () => {
    if (!shareCardRef.current) return;
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null,
        logging: false
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `whos-in-${eventId}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-all"
      >
        <span>🖼️</span> Share Image
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Share on Social Media</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Preview Card - Using explicit linear gradient instead of Tailwind classes */}
            <div 
              ref={shareCardRef}
              style={{
                background: 'linear-gradient(to bottom, #ec4899, #8b5cf6, #6366f1)',
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '1rem',
                overflow: 'hidden',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '500px'
              }}
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', fontFamily: 'var(--font-display, sans-serif)' }}>Who's In? 🎉</h2>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '1rem', 
                padding: '1rem', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{eventEmoji}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem', textAlign: 'center' }}>{eventTitle}</h3>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', textAlign: 'center' }}>
                  {eventDate} at {eventTime}
                </p>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <QRCodeSVG
                  value={eventUrl}
                  size={150}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '1rem', textAlign: 'center' }}>
                Scan to RSVP or visit: whos-in.com
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                onClick={handleGenerateImage}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 