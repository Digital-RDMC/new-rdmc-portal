import React from 'react';

interface PortalQrProps {
  className?: string;
}

const PortalQr: React.FC<PortalQrProps> = ({ className = '' }) => {
  return (
    <svg 
      preserveAspectRatio="xMidYMid meet" 
      version="1.0" 
      viewBox="0 0 600.000000 614.000000" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`w-auto h-full ${className}`}
    >
      <g fill="currentColor" stroke="none" transform="translate(0.000000,614.000000) scale(0.100000,-0.100000)">
        <path d="M0 5505 l0 -635 635 0 635 0 0 635 0 635 -635 0 -635 0 0 -635z
m1090 0 l0 -455 -455 0 -455 0 0 455 0 455 455 0 455 0 0 -455z" />
        <path d="M367 5773 c-4 -3 -7 -127 -7 -275 l0 -268 275 0 275 0 0 275 0 275
-268 0 c-148 0 -272 -3 -275 -7z" />
        <path d="M2000 6050 l0 -90 90 0 90 0 0 -275 0 -275 90 0 90 0 0 275 0 276 93
-3 92 -3 3 -87 3 -88 359 0 360 0 0 90 0 90 90 0 90 0 0 90 0 90 -180 0 -180
0 0 -90 0 -90 -180 0 -180 0 0 90 0 90 -185 0 -185 0 0 -90 0 -90 -90 0 -90 0
0 90 0 90 -90 0 -90 0 0 -90z" />
      </g>
    </svg>
  );
};

export default PortalQr;
