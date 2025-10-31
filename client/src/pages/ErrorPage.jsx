// src/pages/ErrorPage.jsx
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div style={{maxWidth: 720, margin: "10vh auto", textAlign: "center"}}>
      <h2>Oops… Page not found / Access denied</h2>
      <p style={{color:"#666"}}>
        You were redirected to <code>/err</code>. This usually means:
        <br/>• the route doesn’t exist, or
        <br/>• a guard blocked the page (not logged in / wrong role).
      </p>
      <div style={{marginTop: 24, display:"flex", gap:12, justifyContent:"center"}}>
        <Link to="/onboarding">Go to Onboarding</Link>
        <span>·</span>
        <Link to="/home">Go Home</Link>
      </div>
    </div>
  );
}
