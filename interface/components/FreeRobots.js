import React, { useState, useEffect } from "react";

const FreeRobots = ({ serverIP, portIP }) => {
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreeRobots = async () => {
      try {
        // Déterminer le schéma en fonction de la valeur de serverIP
        const scheme = serverIP === "localhost" ? "http" : "https";

        // Utiliser le schéma déterminé dans l'URL
        const response = await fetch(
          `${scheme}://${serverIP}:${portIP}/robots/free`,
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
  }, []);

  const handleRobotSelection = (event) => {
    const selectedRobotId = parseInt(event.target.value, 10);
    const selectedRobot = robots.find((robot) => robot.id === selectedRobotId);
    setSelectedRobot(selectedRobot);
    onRobotSelect(selectedRobot);
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="robotSelector">Sélectionnez un robot :</label>
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
