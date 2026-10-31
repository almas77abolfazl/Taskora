import React from 'react'

interface BrandLogoProps {
  className?: string
  size?: number
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-4 h-4', size = 18 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="6" fill="url(#taskora-gradient)" />
      <path
        d="M6.5 12.5L10 16L17.5 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="8" r="1.5" fill="#38bdf8" />
      <defs>
        <linearGradient
          id="taskora-gradient"
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
