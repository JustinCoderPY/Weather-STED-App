// Tonal UI Kit — Screens
// Globals expected: React, Icon, Background, mockWeather, mockSavedLocations, mockSettings,
//   Phone, StatusBar, Hero, DetailRow, ForecastStrip, FiveDay, BottomBar, IconButton,
//   SavedLocations, Settings, Button

const { useState: useStateScr } = React;

// ===== Welcome screen ========================================================
function WelcomeScreen({ onContinue }) {
  return (
    <Phone>
      <div style={{ position: "absolute", inset: 0, background: "#f6e3c3" }}>
        <Background location="city" time="sunset" weather="clear" />
        <div className="welcome-mask" />
      </div>
      <StatusBar light />
      <div className="welcome-copy">
        <span className="t-meta" style={{ color: "var(--ink-700)" }}>Tonal</span>
        <h1>Skies.<br/>Quietly.</h1>
        <p>An illustrated weather diary for the place you're in.</p>
      </div>
      <div className="onboarding-actions">
        <Button kind="primary" onClick={onContinue}>Get started</Button>
        <Button kind="ghost">I already have an account</Button>
      </div>
    </Phone>
  );
}

// ===== Sign up ===============================================================
const requirements = [
  { label: "8+ characters", ok: true },
  { label: "Uppercase", ok: true },
  { label: "Lowercase", ok: true },
  { label: "Number", ok: true },
  { label: "Special char", ok: false }
];

function SignUpScreen({ onContinue, onSignIn }) {
  return (
    <Phone>
      <div className="auth">
        <div className="auth__illustration">
          <Background location="suburb" time="morning" weather="clear" />
          <div className="auth__fade" />
        </div>
        <StatusBar />
        <div className="auth__topbar auth__topbar--dark">
          <span className="t-meta">Back</span>
          <span className="t-meta">Step 1 / 2</span>
        </div>
        <div className="auth__panel">
          <h2>Welcome<br/>to Tonal.</h2>
          <p>A few details and you are in.</p>
          <div className="auth__name-grid">
            <input className="input" placeholder="First name" defaultValue="Joe" />
            <input className="input" placeholder="Last name" defaultValue="Anderson" />
          </div>
          <input className="input" placeholder="Email address" defaultValue="joe@anderson.co" />
          <input className="input" type="password" placeholder="Password" defaultValue="Tonal2026" />
          <input className="input" type="password" placeholder="Confirm password" defaultValue="Tonal2026" />
          <div className="requirement-list">
            {requirements.map((r) => (
              <span className={r.ok ? "requirement requirement--ok" : "requirement"} key={r.label}>
                <i /> {r.label}
              </span>
            ))}
          </div>
          <Button kind="primary" onClick={onContinue}>Create account</Button>
          <div className="auth__divider"><span /> <em>or</em> <span /></div>
          <Button kind="google" icon={<Icon.Google width="18" height="18" />}>Continue with Google</Button>
          <p className="auth__switch">
            Already a watcher? <strong onClick={onSignIn} style={{ cursor: "pointer" }}>Sign in</strong>
          </p>
        </div>
      </div>
    </Phone>
  );
}

// ===== Sign in ===============================================================
function SignInScreen({ onContinue, onSignUp }) {
  return (
    <Phone>
      <div className="auth">
        <div className="auth__illustration auth__illustration--tall">
          <Background location="park" time="sunset" weather="clear" />
          <div className="auth__fade" />
        </div>
        <StatusBar light />
        <div className="auth__topbar">
          <span className="t-meta">Back</span>
          <span className="t-meta">Tonal</span>
        </div>
        <div className="auth__panel auth__panel--signin">
          <h2>Good to<br/>see you.</h2>
          <p>Sign in to pick up where you left off.</p>
          <input className="input" placeholder="Email or username" defaultValue="joe@anderson.co" />
          <input className="input" type="password" placeholder="Password" defaultValue="••••••••••" />
          <button className="btn--text" type="button" style={{ justifySelf: "end" }}>Forgot password?</button>
          <Button kind="primary" onClick={onContinue}>Sign in</Button>
          <div className="auth__divider"><span /> <em>or</em> <span /></div>
          <Button kind="google" icon={<Icon.Google width="18" height="18" />}>Continue with Google</Button>
          <p className="auth__switch">
            New here? <strong onClick={onSignUp} style={{ cursor: "pointer" }}>Create an account</strong>
          </p>
        </div>
      </div>
    </Phone>
  );
}

// ===== Location consent ======================================================
function LocationConsentScreen({ onAllow, onChoose }) {
  return (
    <Phone>
      <div style={{ position: "absolute", inset: 0 }}>
        <Background location="city" time="sunset" weather="clear" />
      </div>
      <StatusBar light />
      <div className="consent-card">
        <div className="consent-icon"><Icon.Pin width="26" height="26" /></div>
        <h2>Weather<br/>where you are.</h2>
        <p>Tonal uses your location to draw the sky around you. You can change this anytime.</p>
        <Button kind="amber" icon={<Icon.Pin width="18" height="18" />} onClick={onAllow}>Allow location</Button>
        <Button kind="ghost" icon={<Icon.Search width="18" height="18" />} onClick={onChoose}>Choose city manually</Button>
        <div style={{ textAlign: "center" }} className="t-meta">Location stays on your device</div>
      </div>
    </Phone>
  );
}

// ===== Dashboard =============================================================
function DashboardScreen({ onSheet }) {
  const hours = [
    { time: "9 PM", t: 52 }, { time: "10 PM", t: 50 }, { time: "11 PM", t: 49 },
    { time: "12 AM", t: 48 }, { time: "1 AM", t: 47 }, { time: "2 AM", t: 46 },
    { time: "3 AM", t: 46 }, { time: "4 AM", t: 47 }
  ];
  const days = [
    { day: "Today",    icon: <Icon.Cloud width="22" height="22" />,    hi: 55, lo: 49 },
    { day: "Friday",   icon: <Icon.Rain width="22" height="22" />,     hi: 60, lo: 50 },
    { day: "Saturday", icon: <Icon.CloudSun width="22" height="22" />, hi: 64, lo: 52 },
    { day: "Sunday",   icon: <Icon.Sun width="22" height="22" />,      hi: 58, lo: 47 },
    { day: "Monday",   icon: <Icon.Cloud width="22" height="22" />,    hi: 62, lo: 51 }
  ];

  return (
    <Phone>
      <div style={{ position: "absolute", inset: 0 }}>
        <Background location="city" time="sunset" weather="cloudy" />
      </div>
      <StatusBar />
      {/* scrollable content */}
      <div style={{
        position: "absolute", inset: 0, overflowY: "auto",
        paddingTop: 0, paddingBottom: 100, zIndex: 5
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "56px 16px 0", position: "relative", zIndex: 10
        }}>
          <IconButton
            label="Saved places"
            icon={<Icon.Pin width="20" height="20" />}
            onClick={() => onSheet("saved")}
          />
          <IconButton
            label="Settings"
            icon={<Icon.Menu width="20" height="20" />}
            onClick={() => onSheet("settings")}
          />
        </div>
        <Hero
          location="Newark, New Jersey"
          date="Today · Thursday, April 30"
          temp={52}
          summary="Overcast Clouds"
          conditionIcon={<Icon.Cloud width="16" height="16" />}
          hi={55}
          lo={49}
        />
        <DetailRow items={[
          { label: "Humidity",   value: "81%",   icon: <Icon.Drop width="18" height="18" /> },
          { label: "Wind",       value: "10mph", icon: <Icon.Wind width="18" height="18" /> },
          { label: "Visibility", value: "10mi",  icon: <Icon.Eye width="18" height="18" /> }
        ]} />
        <ForecastStrip hours={hours} />
        <div className="section-label">
          <span>5-day forecast</span>
          <span style={{ opacity: 0.6 }}>Newark</span>
        </div>
        <FiveDay days={days} />
        <div className="section-label">
          <span>Sun</span>
          <span style={{ opacity: 0.6 }}>13h 22m of daylight</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 16px 24px" }}>
          <div style={{
            padding: 16, borderRadius: 24,
            background: "rgba(255,248,235,0.7)", backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,245,225,0.55)",
            display: "grid", gap: 6
          }}>
            <div className="t-meta"><Icon.Sunrise width="14" height="14" style={{ verticalAlign: "middle", marginRight: 4 }} /> Sunrise</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>6:20 AM</div>
          </div>
          <div style={{
            padding: 16, borderRadius: 24,
            background: "rgba(255,248,235,0.7)", backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,245,225,0.55)",
            display: "grid", gap: 6
          }}>
            <div className="t-meta"><Icon.Sunset width="14" height="14" style={{ verticalAlign: "middle", marginRight: 4 }} /> Sunset</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>7:42 PM</div>
          </div>
        </div>
      </div>
      <BottomBar active="home" />
    </Phone>
  );
}

Object.assign(window, {
  WelcomeScreen, SignUpScreen, SignInScreen,
  LocationConsentScreen, DashboardScreen
});
