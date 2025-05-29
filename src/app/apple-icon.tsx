import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          position: 'relative',
        }}
      >
        {/* Scales of Justice SVG */}
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          {/* Central pole */}
          <rect x="11.5" y="4" width="1" height="16" fill="white"/>
          
          {/* Top beam */}
          <rect x="6" y="4" width="12" height="1" fill="white"/>
          
          {/* Left scale */}
          <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="0.8" fill="none"/>
          <path d="M5.5 10.5 L10.5 10.5" stroke="white" strokeWidth="0.8"/>
          
          {/* Right scale */}
          <circle cx="16" cy="8" r="2.5" stroke="white" strokeWidth="0.8" fill="none"/>
          <path d="M13.5 10.5 L18.5 10.5" stroke="white" strokeWidth="0.8"/>
          
          {/* Scale chains */}
          <path d="M8 5 L8 8" stroke="white" strokeWidth="0.5"/>
          <path d="M16 5 L16 8" stroke="white" strokeWidth="0.5"/>
          
          {/* Base */}
          <rect x="9" y="19" width="6" height="1" fill="white"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
} 