import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || "Who's In?";
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #ec4899, #8b5cf6, #6366f1)',
          color: 'white',
          padding: '40px',
        }}
      >
        <img 
          src="https://www.whos-in.com/logo_white_no_background.png" 
          width="200" 
          height="200" 
          alt="Logo"
        />
        <h1 style={{ fontSize: '60px', fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </h1>
        <p style={{ fontSize: '28px' }}>
          Event planning made simple
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
