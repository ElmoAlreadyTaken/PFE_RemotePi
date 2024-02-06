// AllRobots.js

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AllRobots = () => {
  const [robots, setRobots] = useState([]);
  const [error, setError] = useState(null);
  const [baseURL, setBaseURL] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [cameraPort, setCameraPort] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from('server_configurations').select('*').single();
      if (data) {
        setBaseURL(data.baseURL); // Assurez-vous que le nom du champ correspond à votre base de données
        setServerPort(data.serverPort);
        setCameraPort(data.cameraPort);
      }
    };

    fetchConfig();
  }, []);
  useEffect(() => {
    const fetchAllRobots = async () => {
      try {
        
        const response = await fetch(
          `${baseURL}:${serverPort}/robots`,
          {
            method: "GET",
            headers: new Headers({
              "ngrok-skip-browser-warning": "69420",
            }),
          }
        );

        const data = await response.json();
        setRobots(data);
      } catch (error) {
        setError("Erreur lors de la récupération des robots.");
      }
    };

    fetchAllRobots();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <ul>
        {robots.map((robot) => (
          <li key={robot.id}>
            <strong>Robot ID:</strong> {robot.id}, <strong>Status:</strong>{" "}
            {robot.status}, <strong>Board:</strong> {robot.board}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllRobots;
