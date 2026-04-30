import React, { useMemo } from "react";

const SKY = {
  morning: ["#f9d3a0", "#f5b58c", "#f3a4a0", "#e89cb3"],
  day: ["#cfe6f5", "#b9d8ec", "#a9cfe6", "#dde9ee"],
  sunset: ["#f7c98a", "#f4a06a", "#e0735a", "#a85b6e"],
  night: ["#1c2640", "#222c4a", "#33365e", "#4a3a5e"]
};

const TONE = {
  morning: { far: "#cf8b6a", mid: "#a86a52", near: "#6b3a2c", accent: "#fbe6c8" },
  day: { far: "#7fa6b9", mid: "#5d8294", near: "#2f4b56", accent: "#eaf3f7" },
  sunset: { far: "#c46451", mid: "#8a3f3a", near: "#3f1f24", accent: "#fbd9aa" },
  night: { far: "#2a2e4a", mid: "#1a1d36", near: "#0a0c1c", accent: "#dbd6f0" }
};

const isWet = (weather) => weather === "rain" || weather === "storm";
const isFoggy = (weather) => weather === "fog" || weather === "mist";

function seededPoints(count, width, height, seed = 17) {
  let value = seed;
  return Array.from({ length: count }, () => {
    value = (value * 9301 + 49297) % 233280;
    const x = (value / 233280) * width;
    value = (value * 9301 + 49297) % 233280;
    const y = (value / 233280) * height;
    value = (value * 9301 + 49297) % 233280;
    const size = value / 233280;
    return { x, y, size };
  });
}

export function SkyBackdrop({ time = "sunset" }) {
  const stops = SKY[time] || SKY.sunset;
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="scene-svg">
      <defs>
        <linearGradient id={`sky-${time}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="40%" stopColor={stops[1]} />
          <stop offset="75%" stopColor={stops[2]} />
          <stop offset="100%" stopColor={stops[3]} />
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill={`url(#sky-${time})`} />
      {time === "night" && <Stars />}
      {time === "sunset" && <Sun cy={460} color="#fde7c4" glow="#f6b87a" />}
      {time === "morning" && <Sun cy={520} color="#fff5e0" glow="#f7c8a0" />}
      {time === "day" && <Sun cy={150} color="#fffbf0" glow="#f9eccb" />}
    </svg>
  );
}

function Sun({ cy, color, glow }) {
  return (
    <g>
      <circle cx="195" cy={cy} r="180" fill={glow} opacity="0.18" />
      <circle cx="195" cy={cy} r="110" fill={glow} opacity="0.32" />
      <circle cx="195" cy={cy} r="60" fill={color} opacity="0.85" />
    </g>
  );
}

function Stars() {
  const stars = useMemo(() => seededPoints(60, 390, 500, 29), []);
  return (
    <g>
      {stars.map((star, index) => (
        <circle key={index} cx={star.x} cy={star.y} r={star.size * 1.2 + 0.3} fill="#fff" opacity={star.size * 0.6 + 0.3} />
      ))}
      <circle cx="290" cy="120" r="22" fill="#f4ecd8" opacity="0.9" />
      <circle cx="282" cy="115" r="18" fill="#33365e" opacity="0.85" />
    </g>
  );
}

function CityScene({ time = "sunset", weather = "cloudy" }) {
  const tone = TONE[time] || TONE.sunset;
  const lit = time === "night" || time === "sunset";
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="scene-svg scene-svg--effect">
      <g opacity="0.55">
        {[0, 30, 70, 110, 150, 180, 220, 260, 300, 340, 370].map((x, index) => {
          const height = 80 + ((index * 37) % 100);
          return <rect key={x} x={x} y={620 - height} width={index % 2 ? 28 : 36} height={height + 220} fill={tone.far} />;
        })}
      </g>
      <g>
        {Array.from({ length: 14 }).map((_, index) => {
          const x = index * 30 - 5;
          const height = 110 + ((index * 53) % 140);
          const width = 32 + ((index * 11) % 12);
          return (
            <g key={index}>
              <rect x={x} y={680 - height} width={width} height={height + 200} fill={tone.mid} />
              {Array.from({ length: Math.floor(height / 18) }).map((__, row) =>
                Array.from({ length: 3 }).map((___, col) => (
                  <rect key={`${row}-${col}`} x={x + 4 + col * 9} y={680 - height + 8 + row * 18} width="4" height="8" fill={lit ? "#ffe7a8" : "#f0e7d6"} opacity={lit ? ((row + col + index) % 3 ? 0.9 : 0.2) : 0.5} />
                ))
              )}
            </g>
          );
        })}
      </g>
      <path d="M0 720 L0 844 L390 844 L390 700 L370 700 L370 660 L340 660 L340 700 L300 700 L300 640 L260 640 L260 700 L210 700 L210 670 L170 670 L170 720 L120 720 L120 690 L80 690 L80 730 L40 730 L40 700 L0 700 Z" fill={tone.near} />
      {isWet(weather) && <Rain />}
      {weather === "snow" && <Snow />}
      {isFoggy(weather) && <Mist />}
      {weather === "cloudy" && <Clouds time={time} />}
    </svg>
  );
}

function SuburbScene({ time = "day", weather = "clear" }) {
  const tone = TONE[time] || TONE.day;
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="scene-svg scene-svg--effect">
      <path d="M0 640 Q 100 580 200 620 T 390 600 L 390 844 L 0 844 Z" fill={tone.far} opacity="0.6" />
      <path d="M0 700 Q 130 660 250 690 T 390 680 L 390 844 L 0 844 Z" fill={tone.mid} opacity="0.8" />
      {[10, 70, 130, 195, 260, 325].map((x, index) => (
        <g key={x} transform={`translate(${x}, ${690 + (index % 2) * 8})`}>
          <polygon points="0,30 30,5 60,30" fill={tone.near} />
          <rect x="5" y="30" width="50" height="40" fill={tone.mid} />
          <rect x="22" y="44" width="14" height="26" fill={tone.near} />
          <rect x="10" y="38" width="8" height="8" fill={time === "night" ? "#ffd98a" : tone.accent} opacity="0.9" />
          <rect x="42" y="38" width="8" height="8" fill={time === "night" ? "#ffd98a" : tone.accent} opacity="0.9" />
        </g>
      ))}
      <path d="M0 760 Q 200 720 390 760 L 390 844 L 0 844 Z" fill={tone.near} />
      {weather === "cloudy" && <Clouds time={time} />}
      {isFoggy(weather) && <Mist />}
      {weather === "snow" && <Snow />}
      {isWet(weather) && <Rain />}
    </svg>
  );
}

function RuralScene({ time = "morning", weather = "clear" }) {
  const tone = TONE[time] || TONE.morning;
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="scene-svg scene-svg--effect">
      <rect x="0" y="600" width="390" height="80" fill={tone.far} opacity="0.6" />
      <path d="M0 660 Q 195 620 390 660 L 390 844 L 0 844 Z" fill={tone.mid} opacity="0.85" />
      {[700, 730, 760, 790, 820].map((y) => (
        <path key={y} d={`M0 ${y} Q 195 ${y - 10} 390 ${y}`} stroke={tone.near} strokeWidth="1" fill="none" opacity="0.4" />
      ))}
      <g transform="translate(60, 660)">
        <polygon points="0,28 25,5 50,28" fill={tone.near} />
        <rect x="3" y="28" width="44" height="40" fill={tone.mid} />
        <rect x="20" y="42" width="10" height="26" fill={tone.near} />
      </g>
      <g transform="translate(310, 670)">
        <rect x="9" y="20" width="4" height="30" fill={tone.near} />
        <circle cx="11" cy="14" r="14" fill={tone.near} />
      </g>
      <path d="M0 790 Q 195 770 390 790 L 390 844 L 0 844 Z" fill={tone.near} />
      {weather === "cloudy" && <Clouds time={time} />}
      {isFoggy(weather) && <Mist />}
      {isWet(weather) && <Rain />}
      {weather === "snow" && <Snow />}
    </svg>
  );
}

function ParkScene({ time = "day", weather = "clear" }) {
  const tone = TONE[time] || TONE.day;
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="scene-svg scene-svg--effect">
      <polygon points="0,640 70,520 140,600 220,480 300,580 390,520 390,720 0,720" fill={tone.far} opacity="0.7" />
      <polygon points="0,680 60,600 130,650 210,560 290,640 360,580 390,620 390,760 0,760" fill={tone.mid} />
      {[0, 18, 38, 58, 80, 102, 130, 158, 188, 218, 250, 282, 314, 348, 376].map((x, index) => {
        const baseY = 720 + (index % 3) * 8;
        const size = 20 + ((index * 7) % 14);
        return (
          <g key={x} transform={`translate(${x}, ${baseY})`}>
            <polygon points={`0,${size} ${size / 2},0 ${size},${size}`} fill={tone.near} />
            <polygon points={`2,${size + 8} ${size / 2},${size * 0.4} ${size - 2},${size + 8}`} fill={tone.near} />
          </g>
        );
      })}
      <path d="M0 800 L 390 800 L 390 844 L 0 844 Z" fill={tone.near} />
      {weather === "cloudy" && <Clouds time={time} />}
      {isFoggy(weather) && <Mist />}
      {isWet(weather) && <Rain />}
      {weather === "snow" && <Snow />}
    </svg>
  );
}

function Rain() {
  const drops = useMemo(() => seededPoints(70, 390, 844, 41), []);
  return (
    <g>
      {drops.map((drop, index) => (
        <line key={index} x1={drop.x} y1={drop.y} x2={drop.x - 2} y2={drop.y + 8 + drop.size * 8} stroke="#cfe0ee" strokeWidth="1" opacity={0.3 + drop.size * 0.4} />
      ))}
    </g>
  );
}

function Snow() {
  const flakes = useMemo(() => seededPoints(50, 390, 844, 53), []);
  return (
    <g>
      {flakes.map((flake, index) => (
        <circle key={index} cx={flake.x} cy={flake.y} r={1 + flake.size * 2} fill="#fff" opacity="0.85" />
      ))}
    </g>
  );
}

function Mist() {
  return (
    <g opacity="0.5">
      <ellipse cx="100" cy="600" rx="160" ry="22" fill="#fff" opacity="0.4" />
      <ellipse cx="290" cy="660" rx="170" ry="18" fill="#fff" opacity="0.3" />
      <ellipse cx="180" cy="720" rx="200" ry="20" fill="#fff" opacity="0.35" />
    </g>
  );
}

function Clouds({ time }) {
  const fill = time === "night" ? "#3a3e58" : "#f5ecdb";
  return (
    <g opacity="0.6">
      <ellipse cx="80" cy="180" rx="60" ry="14" fill={fill} />
      <ellipse cx="280" cy="240" rx="80" ry="16" fill={fill} />
      <ellipse cx="160" cy="300" rx="70" ry="12" fill={fill} />
    </g>
  );
}

export function Background({ location = "city", time = "sunset", weather = "cloudy" }) {
  const Scene = { city: CityScene, suburb: SuburbScene, rural: RuralScene, park: ParkScene }[location] || CityScene;
  return (
    <div className="scene-background">
      <SkyBackdrop time={time} />
      <Scene time={time} weather={weather} />
      <div className="scene-vignette" />
    </div>
  );
}

export default Background;
