import React from "react";
import { Background } from "../components/Backgrounds.jsx";
import { Icon } from "../components/Icons.jsx";

export default function SignInScreen({ onContinue, onSignUp }) {
  return (
    <main className="app-shell">
      <section className="app-surface">      <div className="auth">
      <div className="auth__illustration auth__illustration--tall">
        <Background location="park" time="sunset" weather="clear" />
        <div className="auth__fade" />
      </div>
      <div className="auth__topbar">
        <span className="t-meta">Back</span>
        <span className="t-meta">Tonal</span>
      </div>
      <div className="auth__panel auth__panel--signin">
        <h2>Good to<br />see you.</h2>
        <p>Sign in to pick up where you left off.</p>
        <label className="sr-only" htmlFor="signin-email">Email or username</label>
        <input id="signin-email" className="input" placeholder="Email or username" defaultValue="joe@anderson.co" />
        <label className="sr-only" htmlFor="signin-password">Password</label>
        <input id="signin-password" className="input" type="password" placeholder="Password" defaultValue="password" />
        <button className="btn--text" type="button">Forgot password?</button>
        <button className="btn btn--primary" type="button" onClick={onContinue}>Sign in</button>
        <div className="auth__divider"><span /> <em>or</em> <span /></div>
        <button className="btn btn--google"><Icon.Google width="18" height="18" /> Continue with Google</button>
        <p className="auth__switch">New here? <button type="button" onClick={onSignUp}>Create an account</button></p>
      </div>
      </div>
    </section>
    </main>
  );
}
