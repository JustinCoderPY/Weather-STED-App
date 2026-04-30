import React from "react";
import { Background } from "../components/Backgrounds.jsx";
import { Icon } from "../components/Icons.jsx";

export default function LocationConsentScreen({ onAllow, onChoose }) {
  return (
    <main className="app-shell">
      <section className="app-surface">      <Background location="city" time="sunset" weather="clear" />
      <div className="consent-card">
        <div className="consent-icon"><Icon.Pin width="26" height="26" /></div>
        <h2>Weather<br />where you are.</h2>
        <p>Tonal uses your location to draw the sky around you. You can change this anytime.</p>
        <button className="btn btn--amber" type="button" onClick={onAllow}><Icon.Pin width="18" height="18" /> Allow location</button>
        <button className="btn btn--ghost" type="button" onClick={onChoose}><Icon.Search width="18" height="18" /> Choose city manually</button>
        <div className="t-meta consent-note">Location stays on your device</div>
      </div>
    </section>
    </main>
  );
}
