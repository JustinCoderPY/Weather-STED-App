import React from "react";
import { Background } from "../components/Backgrounds.jsx";

export default function WelcomeScreen({ onContinue, onSignIn }) {
  return (
    <main className="app-shell">
      <section className="app-surface">      <Background location="rural" time="morning" weather="clear" />
      <div className="welcome-mask" />
      <div className="welcome-copy">
        <div className="t-meta">Tonal</div>
        <h1>Weather,<br />in tune.</h1>
        <p>A calmer way to read the weather, made to feel like the place you are standing in.</p>
      </div>
      <div className="onboarding-actions">
        <button className="btn btn--primary" type="button" onClick={onContinue}>Create your account</button>
        <button className="btn btn--ghost" type="button" onClick={onSignIn}>I already have an account</button>
        <div className="onboarding-version">v1.0 poster mode</div>
      </div>
    </section>
    </main>
  );
}
