import React from "react";
import { Background } from "../components/Backgrounds.jsx";
import { Icon } from "../components/Icons.jsx";

const requirements = [
  { label: "8+ characters", ok: true },
  { label: "Uppercase", ok: true },
  { label: "Lowercase", ok: true },
  { label: "Number", ok: true },
  { label: "Special char", ok: false }
];

export default function SignUpScreen({ onContinue, onSignIn }) {
  return (
    <main className="app-shell">
      <section className="app-surface">      <div className="auth">
      <div className="auth__illustration">
        <Background location="suburb" time="morning" weather="clear" />
        <div className="auth__fade" />
      </div>
      <div className="auth__topbar auth__topbar--dark">
        <span className="t-meta">Back</span>
        <span className="t-meta">Step 1 / 2</span>
      </div>
      <div className="auth__panel">
        <h2>Welcome<br />to Tonal.</h2>
        <p>A few details and you are in.</p>
        <div className="auth-name-grid">
          <input className="input" placeholder="First name" defaultValue="Joe" />
          <input className="input" placeholder="Last name" defaultValue="Anderson" />
        </div>
        <input className="input" placeholder="Email address" defaultValue="joe@anderson.co" />
        <input className="input" type="password" placeholder="Password" defaultValue="Tonal2026" />
        <input className="input" type="password" placeholder="Confirm password" defaultValue="Tonal2026" />
        <div className="requirement-list">
          {requirements.map((item) => (
            <span className={item.ok ? "requirement requirement--ok" : "requirement"} key={item.label}>
              <i /> {item.label}
            </span>
          ))}
        </div>
        <button className="btn btn--primary" type="button" onClick={onContinue}>Create account</button>
        <div className="auth__divider"><span /> <em>or</em> <span /></div>
        <button className="btn btn--google"><Icon.Google width="18" height="18" /> Continue with Google</button>
        <p className="auth__switch">Already a watcher? <button type="button" onClick={onSignIn}>Sign in</button></p>
      </div>
      </div>
    </section>
    </main>
  );
}
