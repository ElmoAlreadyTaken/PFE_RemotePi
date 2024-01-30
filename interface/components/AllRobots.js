// AllRobots.js

import React, { useState, useEffect } from 'react';

const AllRobots = () => {
  const [robots, setRobots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllRobots = async () => {
      try {
        const response = await fetch('http://localhost:5000/robots');
        const data = await response.json();
        setRobots(data);
      } catch (error) {
        setError('Erreur lors de la récupération des robots.');
      }
    };

    fetchAllRobots();
  }, []);

  return (
    <div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {robots.map((robot) => (
          <li key={robot.id}>
            <strong>Robot ID:</strong> {robot.id}, <strong>Status:</strong> {robot.status}, <strong>Board:</strong> {robot.board}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllRobots;
