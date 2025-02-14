import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar';
import { Ranking } from './pages/Ranking';
import { Matches } from './pages/Matches';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;