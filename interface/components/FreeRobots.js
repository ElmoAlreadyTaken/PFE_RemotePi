import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const FreeRobots = ({onSelectedRobotChange }) => {
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [error, setError] = useState(null);
  const [baseURLServer, setbaseURLServer] = useState('');
  const [baseURLCamera, setbaseURLCamera] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [cameraPort, setCameraPort] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from('server_configurations').select('*').single();
      if (data) {
        setbaseURLServer(data.baseURLServer); 
        setbaseURLCamera(data.baseURLCamera)
        setServerPort(data.serverPort);
        setCameraPort(data.cameraPort); 
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchFreeRobots = async () => {
      try {
        // Assurez-vous que baseURLServer et serverPort ne sont pas vides
        if (!baseURLServer || !serverPort) return;
  
        const response = await fetch(
          `${baseURLServer}:${serverPort}/robots/free`, // Assurez-vous d'inclure le ":" pour séparer le port
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
  
    fetchFreeRobots();
  }, [baseURLServer, serverPort, cameraPort]);  

  const handleRobotSelection = (event) => {
    const selectedRobotId = parseInt(event.target.value, 10);
    const selectedRobot = robots.find((robot) => robot.id === selectedRobotId);
    setSelectedRobot(selectedRobot);
    if (onSelectedRobotChange) {
      onSelectedRobotChange(selectedRobot);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="robotSelector">Robot sélectionné :</label>
      <select id="robotSelector" onChange={handleRobotSelection}>
        <option value="">Sélectionnez un robot</option>
        {robots.map((robot) => (
          <option key={robot.id} value={robot.id}>
            Robot ID: {robot.id}
          </option>
        ))}
      </select>

      {selectedRobot && (
        <div>
          <p>
            <strong>Robot ID:</strong> {selectedRobot.id},{" "}
            <strong>Status:</strong> {selectedRobot.status},{" "}
            <strong>Board:</strong> {selectedRobot.board}
          </p>
        </div>
      )}
    </div>
  );
};

export default FreeRobots;
