// AllRobots.js

import React, { useState, useEffect } from 'react';

const AllRobots = () => {
  const [robots, setRobots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllRobots = async () => {
      try {
        // Déterminer le schéma en fonction de la valeur de serverIP
        const scheme = serverIP === 'localhost' ? 'http' : 'https';

        // Utiliser le schéma déterminé dans l'URL
        const response = await fetch(`${scheme}://${serverIP}:${portIP}/robots`, {
        method: "GET",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
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
