import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./components/Navbar"
import DispatchCard from "./components/DispatchCard"
import { WagmiProvider } from './providers/Wagmi';

// CRA and buffer dont play nice
window.Buffer = window.Buffer || require("buffer").Buffer;

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  const navigate = useNavigate();

  // if there is no route, redirect to /info-card
  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate("/info-card")
    }
  }, [navigate]);

  return (
    <WagmiProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="info-card" element={<DispatchCard dispatchMessageId="120" />} />
          <Route path="poll-card" element={<DispatchCard dispatchMessageId="196" />} />
          <Route path="action-card" element={<DispatchCard dispatchMessageId="269" />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
    </WagmiProvider>
  );
}

export default App;
