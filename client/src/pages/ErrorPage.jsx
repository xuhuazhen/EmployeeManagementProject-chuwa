// src/pages/ErrorPage.jsx
// import { Link } from "react-router-dom";

// export default function ErrorPage() {
//   return (
//     <div style={{maxWidth: 720, margin: "10vh auto", textAlign: "center"}}>
//       <h2>Oops… Page not found / Access denied</h2>
//       <p style={{color:"#666"}}>
//         You were redirected to <code>/err</code>. This usually means:
//         <br/>• the route doesn’t exist, or
//         <br/>• a guard blocked the page (not logged in / wrong role).
//       </p>
//       <div style={{marginTop: 24, display:"flex", gap:12, justifyContent:"center"}}>
//         <Link to="/onboarding">Go to Onboarding</Link>
//         <span>·</span>
//         <Link to="/home">Go Home</Link>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom"; 
import React from 'react';
import { Button, Result } from 'antd'; 
import MainLayout from "../components/mainLayout/mainLayout";

const ErrorPage = () => {
    const navigate = useNavigate();

    return <>
        <MainLayout>
            <Result
                style={{ 
                    backgroundColor: 'white',
                    minHeight: '300px',
                    height: 'calc(100vh - 200px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Oops, something went wrong!"
                extra={
                    <Button 
                        type="primary" 
                        key="console"
                        onClick={() => navigate('/')}
                    >
                        Go Home
                    </Button>
                 }
            />
        </MainLayout>
    </>
};

export default ErrorPage;
