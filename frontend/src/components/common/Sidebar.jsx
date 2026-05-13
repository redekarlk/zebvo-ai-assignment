'use client';

import { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
        {isOpen ? '←' : '→'}
      </button>
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/projects">My Projects</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><a href="/help">Help</a></li>
        </ul>
      </nav>
    </aside>
  );
}
