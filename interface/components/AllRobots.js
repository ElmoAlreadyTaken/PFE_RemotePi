// AllRobots.js

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AllRobots = () => {
  const [robots, setRobots] = useState([]);
  const [error, setError] = useState(null);
  const [baseURLServer, setBaseURLServer] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [cameraPort, setCameraPort] = useState('');
  const [baseURLCamera, setbaseURLCamera] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from('server_configurations').select('*').single();
      if (data) {
        setBaseURLServer(data.baseURLServer); 
        setbaseURLCamera(data.baseURLCamera);
        setServerPort(data.serverPort);
        setCameraPort(data.cameraPort);
        setConfigLoaded(true); // Indiquez que la configuration est chargée
      }
    };
  
    fetchConfig();
  }, []); // Ce useEffect ne devrait être exécuté qu'une seule fois au montage du composant
  
  useEffect(() => {
    if (configLoaded) { // Exécutez `fetchAllRobots` uniquement si la configuration est chargée
      const fetchAllRobots = async () => {
        try {
          const response = await fetch(
            `${baseURLServer}:${serverPort}/robots`,
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
    }
  }, [configLoaded, baseURLServer, serverPort]); // Dépendez de `configLoaded` pour contrôler l'exécution
  

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