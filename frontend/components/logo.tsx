export function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#A855F7" }} />
          <stop offset="100%" style={{ stopColor: "#3B82F6" }} />
        </linearGradient>
      </defs>
      <path
        d="M50 10C35 10 25 20 20 30C15 40 15 45 15 50C15 55 20 65 30 70C40 75 45 75 50 75C55 75 60 75 70 70C80 65 85 55 85 50C85 45 85 40 80 30C75 20 65 10 50 10Z"
        fill="url(#logoGradient)"
      />
      {/* Hawk Eye (Camera Lens) */}
      <circle cx="50" cy="45" r="12" fill="#1E293B" />
      <circle cx="50" cy="45" r="8" fill="#0F172A" />
      <circle cx="47" cy="42" r="3" fill="#FFFFFF" fillOpacity="0.6" />
      {/* Car Silhouette */}
      <path
        d="M40 60H60C62 60 63 61 63 62L65 65C65 66 64 67 63 67H37C36 67 35 66 35 65L37 62C37 61 38 60 40 60Z"
        fill="#1E293B"
      />
    </svg>
  )
}

