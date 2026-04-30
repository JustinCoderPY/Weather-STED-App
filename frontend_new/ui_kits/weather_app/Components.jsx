// Tonal UI Kit — primitive UI components
// Globals expected: React, Icon (from Icons.jsx), Background (from Backgrounds.jsx)

const { useState, useEffect } = React;

// ===== Phone shell ==========================================================
function Phone({ children, label }) {
  return (
    <div className="phone-wrap">
      {label && <div className="screen-tag">{label}</div>}
      <div className="phone">
        <div className="phone__notch" />
        {children}
      </div>
    </div>
  );
}

function StatusBar({ light }) {
  return (
    <div className={"statusbar" + (light ? " statusbar--light" : "")}>
      <span>9:41</span>
      <span className="statusbar__icons" aria-hidden>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
          <rect x="0" y="6" width="3" height="5" rx="0.5"/>
          <rect x="5" y="4" width="3" height="7" rx="0.5"/>
          <rect x="10" y="2" width="3" height="9" rx="0.5"/>
          <rect x="15" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 2.3a8.6 8.6 0 0 1 6.1 2.5l1.4-1.4A10.6 10.6 0 0 0 8 .3a10.6 10.6 0 0 0-7.5 3.1l1.4 1.4A8.6 8.6 0 0 1 8 2.3zm0 4a4.6 4.6 0 0 1 3.3 1.3l1.4-1.4a6.6 6.6 0 0 0-9.4 0l1.4 1.4A4.6 4.6 0 0 1 8 6.3zm-2.1 3.1L8 11.5l2.1-2.1a3 3 0 0 0-4.2 0z"/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.5"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23" y="4" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.5"/>
        </svg>
      </span>
    </div>
  );
}

// ===== Buttons ==============================================================
function Button({ kind = "primary", icon, children, onClick }) {
  const cls = "btn btn--" + kind;
  return (
    <button className={cls} onClick={onClick} type="button">
      {icon}
      {children}
    </button>
  );
}

function IconButton({ icon, label, ghost, onClick }) {
  return (
    <button
      className={"icon-btn" + (ghost ? " icon-btn--ghost" : "")}
      aria-label={label}
      type="button"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

// ===== Bottom bar ===========================================================
function BottomBar({ active = "home", onChange }) {
  const items = [
    { id: "home", icon: <Icon.Sun width="22" height="22" /> },
    { id: "saved", icon: <Icon.Pin width="22" height="22" /> },
    { id: "settings", icon: <Icon.Settings width="22" height="22" /> }
  ];
  return (
    <nav className="bottombar" aria-label="Primary">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={"bottombar__btn" + (it.id === active ? " bottombar__btn--active" : "")}
          aria-label={it.id}
          onClick={() => onChange && onChange(it.id)}
        >
          {it.icon}
        </button>
      ))}
    </nav>
  );
}

// ===== Hero (location, date, big temp, summary, range) ======================
function Hero({ location, date, temp, summary, hi, lo, conditionIcon }) {
  return (
    <div className="hero">
      <div className="hero__loc">
        <Icon.Pin width="13" height="13" />
        {location}
      </div>
      <div className="hero__date">{date}</div>
      <div className="hero__temp">
        {temp}<sup>°</sup>
      </div>
      <div className="hero__summary">
        {conditionIcon}
        {summary}
      </div>
      <div className="hero__range">
        <span>Feels <strong>50°</strong></span>
        <span aria-hidden style={{ opacity: 0.4 }}>·</span>
        <span>H <strong>{hi}°</strong></span>
        <span>L <strong>{lo}°</strong></span>
      </div>
    </div>
  );
}

// ===== Detail row (humidity, wind, visibility) ==============================
function DetailRow({ items }) {
  return (
    <div className="detail-row">
      {items.map((it) => (
        <div className="detail-row__cell" key={it.label}>
          <div className="detail-row__icon">{it.icon}</div>
          <div className="detail-row__value">{it.value}</div>
          <div className="detail-row__label">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ===== Forecast strip (hourly) ==============================================
function tempBucket(t) {
  if (t < 40) return "cool";
  if (t < 55) return "mid";
  if (t < 70) return "warm";
  return "hot";
}

function ForecastStrip({ hours }) {
  return (
    <div className="fstrip">
      <div className="fstrip__head">
        <span className="fstrip__title">Hourly</span>
        <span className="fstrip__hint">Swipe ›</span>
      </div>
      <div className="fstrip__scroll">
        {hours.map((h, i) => (
          <div key={h.time + i} className={"hour" + (i === 0 ? " hour--now" : "")}>
            <div className="hour__time">{i === 0 ? "Now" : h.time}</div>
            <div className={"hour__dot hour__dot--" + tempBucket(h.t)} />
            <div className="hour__temp">{h.t}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Five day forecast ====================================================
function FiveDay({ days }) {
  const max = Math.max(...days.map((d) => d.hi));
  const min = Math.min(...days.map((d) => d.lo));
  const span = max - min || 1;
  return (
    <div className="fivecard">
      {days.map((d) => {
        const left = ((d.lo - min) / span) * 100;
        const width = ((d.hi - d.lo) / span) * 100;
        return (
          <div className="fiverow" key={d.day}>
            <div className="fiverow__day">{d.day}</div>
            <div className="fiverow__icon">{d.icon}</div>
            <div className="fiverow__bar">
              <i style={{ left: left + "%", width: Math.max(8, width) + "%" }} />
            </div>
            <div className="fiverow__temps">
              <em>{d.lo}°</em>
              <strong>{d.hi}°</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== Sheets ==============================================================
function Sheet({ title, onClose, children }) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2 className="sheet__title">{title}</h2>
          <button
            type="button"
            className="btn--text"
            style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--ink-500)", fontSize: 14 }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

function SavedLocations({ items, onClose, currentId, onPick }) {
  return (
    <Sheet title="Saved places" onClose={onClose}>
      {items.map((p) => (
        <div
          key={p.id}
          className={"savecard" + (p.id === currentId ? " savecard--current" : "")}
          onClick={() => onPick && onPick(p.id)}
        >
          <div>
            <div className="savecard__name">{p.name}</div>
            <div className="savecard__sub">
              <Icon.Pin width="12" height="12" />
              {p.state} · {p.condition}
            </div>
          </div>
          <div className="savecard__temp">{p.temperature}°</div>
          <button className="savecard__del" type="button" aria-label="Remove">
            <Icon.Trash width="16" height="16" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn--ghost"
        style={{ marginTop: 8 }}
      >
        <Icon.Plus width="18" height="18" /> Add a place
      </button>
    </Sheet>
  );
}

function Settings({ onClose, settings, onChange }) {
  const seg = (val, current, key) => (
    <button
      type="button"
      className={current === val ? "is-on" : ""}
      onClick={() => onChange && onChange(key, val)}
    >
      {val.toUpperCase()}
    </button>
  );

  return (
    <Sheet title="Settings" onClose={onClose}>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Sun width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Temperature</div>
          <div className="setrow__sub">Imperial or metric</div>
        </div>
        <div className="segment">
          {seg("°f", settings.unit, "unit")}
          {seg("°c", settings.unit, "unit")}
        </div>
      </div>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Compass width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Measurements</div>
          <div className="setrow__sub">mph & inches, or km/h & cm</div>
        </div>
        <div className="segment">
          {seg("us", settings.system, "system")}
          {seg("metric", settings.system, "system")}
        </div>
      </div>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Moon width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Theme</div>
          <div className="setrow__sub">Follows the sky by default</div>
        </div>
        <div className="segment">
          {seg("dynamic", settings.theme, "theme")}
          {seg("light", settings.theme, "theme")}
          {seg("dark", settings.theme, "theme")}
        </div>
      </div>
      <div className="setrow">
        <div className="setrow__icon"><Icon.User width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Account</div>
          <div className="setrow__sub">joe@anderson.co</div>
        </div>
        <Icon.ChevR width="18" height="18" style={{ color: "var(--ink-500)" }} />
      </div>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Lock width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Change password</div>
          <div className="setrow__sub">Last updated 4 months ago</div>
        </div>
        <Icon.ChevR width="18" height="18" style={{ color: "var(--ink-500)" }} />
      </div>
      <button
        type="button"
        className="btn btn--ghost"
        style={{ marginTop: 16, color: "#8a3030" }}
      >
        <Icon.Logout width="18" height="18" /> Log out
      </button>
    </Sheet>
  );
}

// Expose to the rest of the kit
Object.assign(window, {
  Phone, StatusBar, Button, IconButton, BottomBar,
  Hero, DetailRow, ForecastStrip, FiveDay,
  Sheet, SavedLocations, Settings
});
