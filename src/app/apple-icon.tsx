import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Dynamic PR Apple Touch Icon generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 84,
          background: 'linear-gradient(135deg, #0b57d0 0%, #0842a0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: 42,
          letterSpacing: '-2px',
          fontFamily: 'sans-serif',
        }}
      >
        PR
      </div>
    ),
    {
      ...size,
    }
  );
}
