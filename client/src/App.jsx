import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatAssistant from './components/ChatAssistant';
import Timeline from './components/Timeline';
import BoothFinder from './components/BoothFinder';
import Quiz from './components/Quiz';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/booth-finder" element={<BoothFinder />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </div>
  );
}
