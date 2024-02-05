// pages/admin.js
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function AdminPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [logList, setLogList] = useState([]);
  const [serverIP, setServerIP] = useState(
    "8d73-195-115-93-124.ngrok-free.app"
  ); // Nouvelle adresse IP du serveur
  const [portIP, setPortIP] = useState(443); // Nouveau port

  const fetchLogs = async () => {
    try {
      c// Déterminer le schéma en fonction de la valeur de serverIP
      const scheme = serverIP === 'localhost' ? 'http' : 'https';

      const response = await fetch(`${scheme}://${serverIP}:${portIP}/log`, {
        method: "GET",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
      if (!response.ok) {
        throw new Error("Serveur indisponible"); // Peut indiquer une erreur 4XX/5XX
      }
      const log = await response.json();
      const newLogList = Array.isArray(log) ? log : [log];
      console.log("log :", log);
      setLogList((prevLogList) => [...prevLogList, ...newLogList]);
      setErrorMessage(""); // Réinitialiser le message d'erreur en cas de succès
    } catch (error) {
      console.error(error); // Conserver pour le debug, mais vous pourriez vouloir le retirer en production
      setErrorMessage("Serveur indisponible."); // Utiliser un message générique pour l'utilisateur
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLogs();
    }, 1000); // Exécute `fetchLogs` toutes les 1000 millisecondes (1 seconde)

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, [serverIP, portIP]); // Les dépendances assurent que l'intervalle est réinitialisé si `serverIP` ou `portIP` changent

  const clearLogs = () => {
    setLogList([]);
  };

  const handleServerIPChange = (e) => {
    setServerIP(e.target.value);
    let ip = e.target.value;
    // Vérifier si la chaîne se termine par un slash et le supprimer
    if (ip.endsWith("/")) {
      ip = ip.slice(0, -1);
    }
    setServerIP(ip);
    console.log("ip :", serverIP);
  };

  // Fonction pour gérer le changement du port du serveur
  const handlePortIPChange = (e) => {
    setPortIP(e.target.value);
  };

  return (
    <div>
      <br></br>
      <br></br>
      <div>
        <label>
          Server IP:
          <input type="text" value={serverIP} onChange={handleServerIPChange} />
        </label>
        <label>
          Server Port:
          <input type="number" value={portIP} onChange={handlePortIPChange} />
        </label>
        <button onClick={fetchLogs}>Fetch Logs</button>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <button
          onClick={clearLogs}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Effacer
        </button>
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
        )}
        <div>
          <br></br>
        </div>
        <div
          className="relative overflow-x-auto shadow-md sm:rounded-lg"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" style={{ width: "10%" }} className="px-6 py-3">
                  Index
                </th>
                <th scope="col" style={{ width: "90%" }} className="px-6 py-3">
                  Message/Error
                </th>
              </tr>
            </thead>

            <tbody>
              {logList.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td
                    className={`px-6 py-4 ${
                      log.error ? "text-red-500" : "text-black"
                    }`}
                  >
                    {log.message || log.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}
