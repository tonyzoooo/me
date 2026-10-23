'use client'

import type { User } from '../payload-types.js'

// Pastel backgrounds chosen to contrast with the golden onion
const palette = [
  '#a8d5ba', // mint
  '#f4b8c1', // pink
  '#b8c9f0', // periwinkle
  '#d9c8f0', // lilac
  '#c9e4a8', // light green
  '#f0d5a8', // cream
]

function hashSeed(seed: string): number {
  let hash = 7
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 9973
  }
  return hash
}

export const OnionAvatar = ({ user }: { user?: User }) => {
  const seed = String(user?.id ?? user?.email ?? 'onion')
  const background = palette[hashSeed(seed) % palette.length]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.75rem',
        height: '1.75rem',
        borderRadius: '50%',
        background,
        overflow: 'hidden',
      }}
    >
      <svg
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(0 1.5)">
          <g fill="none" stroke="#8ac261" strokeWidth="4" strokeLinecap="round">
            <path d="M32 13C31 8.5 28 5 23 2.5" />
            <path d="M32 13V2.5" />
            <path d="M32 13c1-5 4-8 9-10.5" />
          </g>
          <path
            d="M32 13c13 0 21 11 21 22 0 10-9 17-21 19C20 52 11 45 11 35c0-11 8-22 21-22Z"
            fill="#f9c664"
            stroke="#b8862e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <g
            fill="none"
            stroke="#b8862e"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.55"
          >
            <path d="M26 15c-6.5 8-8.5 22-3.5 34" />
            <path d="M30 15.5c-4 9-5 24-2 36" />
            <path d="M34 15.5c4 9 5 24 2 36" />
            <path d="M38 15c6.5 8 8.5 22 3.5 34" />
          </g>
          <g fill="#4b3a25">
            <circle cx="28" cy="31" r="2.1" />
            <circle cx="36" cy="31" r="2.1" />
          </g>
          <path
            d="M29 37.5q3 3.2 6 0"
            fill="none"
            stroke="#4b3a25"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <g fill="#f4a09c" opacity="0.65">
            <circle cx="24" cy="35.5" r="2.4" />
            <circle cx="40" cy="35.5" r="2.4" />
          </g>
          <g fill="none" stroke="#a97b2c" strokeWidth="2.5" strokeLinecap="round">
            <path d="m28 53.5-4 3.5" />
            <path d="m30 54.5-1.5 4" />
            <path d="M32 55v4" />
            <path d="m34 54.5 1.5 4" />
            <path d="m36 53.5 4 3.5" />
          </g>
        </g>
      </svg>
    </span>
  )
}

export default OnionAvatar
