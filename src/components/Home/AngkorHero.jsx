/**
 * AngkorHero
 * ──────────
 * FILE    src/components/Home/AngkorHero.jsx  (+ AngkorHero.module.css)
 *
 * PURPOSE
 *   Decorative banner for the Home page: Angkor Wat at sunrise, rising above the jungle,
 *   reflected in its pool and framed by sugar palms (Cambodia's national tree).
 *   Palms sway, clouds drift and the water shimmers; all motion stops for players who
 *   ask their device for reduced motion.
 *
 * EXPORT
 *   export default function AngkorHero()
 *
 * NOTES
 *   - Pure SVG drawn by hand, no image files or outside assets.
 *   - Hidden from screen readers (aria-hidden): the page title below says what the page is.
 */
import styles from './AngkorHero.module.css'

const NAVY = '#1b2f5e' // temple silhouette, close to --text-h
const JUNGLE_FAR = '#6fa392'
const JUNGLE_MID = '#1d5c4b'
const JUNGLE_NEAR = '#0f4236'
const PALM = '#123e33'
const PALM_LEAF = '#145244'

// One lotus-bud tower: straight lower walls that curve in to a point.
function towerPath(cx, baseY, w, h) {
  const l = cx - w / 2
  const r = cx + w / 2
  return [
    `M${l},${baseY}`,
    `L${l},${baseY - h * 0.3}`,
    `C${l},${baseY - h * 0.72} ${cx - w * 0.18},${baseY - h * 0.86} ${cx},${baseY - h}`,
    `C${cx + w * 0.18},${baseY - h * 0.86} ${r},${baseY - h * 0.72} ${r},${baseY - h * 0.3}`,
    `L${r},${baseY}`,
    'Z',
  ].join(' ')
}

// The five towers of Angkor Wat: tallest in the middle, then inner and outer pairs.
const TOWERS = [
  [316, 190, 22, 44],
  [484, 190, 22, 44],
  [354, 178, 26, 60],
  [446, 178, 26, 60],
  [400, 178, 34, 92],
]

function Temple() {
  return (
    <g fill={NAVY}>
      <rect x="230" y="202" width="340" height="14" />
      <rect x="262" y="190" width="276" height="12" />
      <rect x="300" y="178" width="200" height="12" />
      {TOWERS.map(([cx, by, w, h]) => (
        <path key={cx} d={towerPath(cx, by, w, h)} />
      ))}
    </g>
  )
}

// Sugar palm: a thin, slightly curved trunk with a round crown of fronds.
const FROND_ANGLES = [-175, -150, -125, -100, -80, -55, -30, -5]

function Palm({ x, ground, height, scale, delay }) {
  const topX = x + 4 * scale
  const topY = ground - height
  const len = 34 * scale
  return (
    <g>
      <path
        d={`M${x},${ground} Q${x + 8 * scale},${ground - height * 0.5} ${topX},${topY}`}
        fill="none"
        stroke={PALM}
        strokeWidth={5 * scale}
        strokeLinecap="round"
      />
      <g transform={`translate(${topX} ${topY})`}>
        <g className={styles.sway} style={{ animationDelay: `${delay}s` }}>
          {FROND_ANGLES.map((deg) => {
            const a = (deg * Math.PI) / 180
            const droop = Math.abs(Math.cos(a)) * 9 * scale
            const ex = Math.cos(a) * len
            const ey = Math.sin(a) * len + droop
            const cx = Math.cos(a) * len * 0.5
            const cy = Math.sin(a) * len * 0.5 - 4 * scale
            return (
              <path
                key={deg}
                d={`M0,0 Q${cx},${cy} ${ex},${ey}`}
                fill="none"
                stroke={PALM_LEAF}
                strokeWidth={4.5 * scale}
                strokeLinecap="round"
              />
            )
          })}
          <circle r={5 * scale} fill={PALM} />
        </g>
      </g>
    </g>
  )
}

export default function AngkorHero() {
  return (
    <svg
      className={styles.hero}
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="angkor-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe8ff" />
          <stop offset="0.6" stopColor="#fdebc4" />
          <stop offset="1" stopColor="#ffe2a8" />
        </linearGradient>
        <linearGradient id="angkor-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d7e6f7" />
          <stop offset="1" stopColor="#b9d1ec" />
        </linearGradient>
        <clipPath id="angkor-water-clip">
          <rect x="0" y="216" width="800" height="84" />
        </clipPath>
      </defs>

      {/* Sky, sunrise and clouds */}
      <rect width="800" height="216" fill="url(#angkor-sky)" />
      <circle cx="400" cy="150" r="95" fill="#f7cc4b" opacity="0.18" />
      <circle cx="400" cy="150" r="62" fill="#f7cc4b" opacity="0.55" />
      <g className={styles.clouds} fill="#ffffff" opacity="0.85">
        <ellipse cx="150" cy="60" rx="50" ry="12" />
        <ellipse cx="185" cy="51" rx="34" ry="12" />
        <ellipse cx="610" cy="80" rx="56" ry="13" />
        <ellipse cx="650" cy="71" rx="30" ry="10" />
      </g>

      {/* Distant jungle and the temple */}
      <path
        d="M0,205 Q40,188 80,198 T160,195 T240,200 T320,192 T400,198 T480,190 T560,199 T640,191 T720,198 T800,192 L800,216 L0,216 Z"
        fill={JUNGLE_FAR}
        opacity="0.55"
      />
      <Temple />

      {/* Reflecting pool with a faint mirrored temple */}
      <rect y="216" width="800" height="84" fill="url(#angkor-water)" />
      <g clipPath="url(#angkor-water-clip)" opacity="0.18">
        <g transform="translate(0 432) scale(1 -1)">
          <Temple />
        </g>
      </g>
      <path
        className={styles.shimmer}
        d="M300,238 h60 M450,250 h80 M220,266 h50 M520,276 h70 M360,286 h40"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Jungle framing both sides */}
      <path
        d="M0,300 L0,222 Q30,205 60,218 Q95,196 130,216 Q160,204 185,226 Q205,220 220,240 L220,300 Z"
        fill={JUNGLE_MID}
      />
      <path
        d="M800,300 L800,218 Q770,200 738,214 Q700,194 668,216 Q640,206 612,228 Q592,222 578,242 L578,300 Z"
        fill={JUNGLE_MID}
      />
      <Palm x={70} ground={250} height={125} scale={1} delay={0} />
      <Palm x={150} ground={258} height={92} scale={0.8} delay={-1.6} />
      <Palm x={724} ground={250} height={135} scale={1.05} delay={-0.8} />
      <Palm x={644} ground={262} height={86} scale={0.75} delay={-2.4} />
      <path d="M0,300 L0,252 Q35,234 70,250 Q100,238 130,262 L142,300 Z" fill={JUNGLE_NEAR} />
      <path d="M800,300 L800,250 Q765,232 730,248 Q700,238 672,262 L660,300 Z" fill={JUNGLE_NEAR} />
    </svg>
  )
}
