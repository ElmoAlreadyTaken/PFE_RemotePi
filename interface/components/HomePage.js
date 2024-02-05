import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import FileUpload from "./FileUpload";
import FreeRobots from "./FreeRobots";
import AllRobots from "./AllRobots";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";

export default function HomePage(props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [logList, setLogList] = useState([]);
  const [blink, setBlink] = useState(false);
  const refreshComponents = () => {
    // Activer le clignotement
    setBlink(true);

    // Réinitialiser le clignotement après un court délai (par exemple, 500 ms)
    setTimeout(() => {
      setBlink(false);
    }, 100);
    // Incrémente la clé de rafraîchissement pour forcer le re-render des composants
    setRefreshKey((prevKey) => prevKey + 1);
  };
  var template = `#include <remotePi.h>

  void setup() {
    Serial.begin(115200);
    config.begin();
  }

  void loop() {
    config.handleClient();
    MDNS.update();
  }`;
  const router = useRouter();
  const [editorContent, setEditorContent] = useState(template);
  const [boutonStyle, setBoutonStyle] = useState(
    "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
  );
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [boutonTexte, setBoutonTexte] = useState("Téléverser");
  const [serverIP, setServerIP] = useState("4.tcp.eu.ngrok.io"); // Nouvelle adresse IP du serveur
  const [portIP, setPortIP] = useState(17707); // Nouveau port
  const [isAllRobotsVisible, setAllRobotsVisibility] = useState(false);

  const fetchLogs = async () => {
    try {
      // Déterminer le schéma en fonction de la valeur de serverIP
      const scheme = serverIP === "localhost" ? "http" : "https";

      // Utiliser le schéma déterminé dans l'URL
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
    }, 100000000000); // Exécute `fetchLogs` toutes les 1000 millisecondes (1 seconde)

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, [serverIP, portIP, refreshKey]); // Les dépendances assurent que l'intervalle est réinitialisé si `serverIP` ou `portIP` changent

  const clearLogs = () => {
    setLogList([]);
  };
  const toggleAllRobotsVisibility = () => {
    setAllRobotsVisibility(!isAllRobotsVisible);
  };
  useEffect(() => {
    // Diviser le template en lignes ou en éléments clés
    const lignesTemplate = template.split("\n");
    // Vérifier si chaque ligne du template est présente dans le contenu de l'éditeur
    const templateEstPresent = lignesTemplate.every((ligne) =>
      editorContent.includes(ligne.trim())
    );
    if (templateEstPresent) {
      setBoutonStyle(
        "text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      );
      setBoutonTexte("Téléverser");
    } else {
      setBoutonStyle(
        "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      );
      setBoutonTexte("Doit contenir le template");
    }
  }, [editorContent]);

  const verifierContenu = async () => {
    // Diviser le template en lignes ou en éléments clés
    const lignesTemplate = template.split("\n");
    // Vérifier si chaque ligne du template est présente dans le contenu de l'éditeur
    const templateEstPresent = lignesTemplate.every((ligne) =>
      editorContent.includes(ligne.trim())
    );
    if (templateEstPresent) {
      alert("La configuration ESP est présente dans le contenu.");
      console.log("ip : ", serverIP, "port :", portIP);
      try {
        // Créer un Blob avec le contenu de l'éditeur
        const blob = new Blob([editorContent], { type: "text/plain" });

        // Créer un objet FormData et y ajouter le Blob en tant que fichier
        const formData = new FormData();
        formData.append("file", blob, "monFichier.ino");

        // Utiliser l'API Fetch pour envoyer le fichier au serveur
        // Déterminer le schéma en fonction de la valeur de serverIP
        const scheme = serverIP === "localhost" ? "http" : "https";

        const response = await fetch(
          `${scheme}://${serverIP}:${portIP}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          console.log("Fichier envoyé avec succès");
          // Traitement supplémentaire en cas de succès
        } else {
          console.error("Échec de l'envoi du fichier");
          // Gérer les erreurs ici
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du fichier", error);
        // Gérer les erreurs réseau ici
      }
    } else {
      alert(
        "Le contenu de l'éditeur doit au moins contenir le template de base."
      );
    }
  };

  const onChange = (newValue) => {
    setEditorContent(newValue);
  };

  return (
    <div className="">
      <br></br>
      <div className="freeRobotsContainer flex justify-center items-center">
        <FreeRobots
          key={refreshKey}
          onRobotSelect={setSelectedRobot}
          serverIP={serverIP}
          portIP={portIP}
        />
      </div>
      {!selectedRobot && (
        <p
          style={{
            color: "red",
            marginLeft: "1300px",
            position: "absolute",
            marginTop: "0px",
          }}
        >
          Veuillez sélectionner un robot.
        </p>
      )}
      <img
        src="refresh-icon.png"
        alt="Refresh Icon"
        onClick={refreshComponents}
        style={{
          marginLeft: "1200px",
          marginTop: "-25px",
          cursor: "pointer",
          position: "absolute",
          width: "35px",
          height: "35px",
          animation: blink ? "blink 1s" : "none", // Appliquer l'animation si le clignotement est activé
        }}
      />
      <div>
        <button
          onClick={toggleAllRobotsVisibility}
          style={{
            marginLeft: "875px",
          }}
        >
          {isAllRobotsVisible ? "Masquer les robots" : "Afficher les robots"}
        </button>
        {isAllRobotsVisible && (
          <div className="AllRobotsContainer flex justify-center items-center ">
            <br></br>
            <AllRobots serverIP={serverIP} portIP={portIP} />
          </div>
        )}
      </div>

      <br></br>
      <div className="fileUploadContainer flex justify-center items-center">
        <FileUpload
          serverIP={serverIP}
          setServerIP={setServerIP}
          portIP={portIP}
          setPortIP={setPortIP}
          robotID={selectedRobot ? selectedRobot.id : null}
        />
      </div>

      <br></br>
      <div className="flex ">
        <div className="streamContainer  ml-1">
          <iframe
            src="" //"https://player.twitch.tv/?channel=otplol_&parent=localhost"
            height="720"
            width="1280"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
          ></iframe>
        </div>
        <div className="aceEditorContainer ml-2">
          <AceEditor
            mode="c_cpp"
            theme="monokai"
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            value={editorContent}
            editorProps={{ $blockScrolling: true }}
            className="aceEditor"
          />
        </div>
      </div>
      <br></br>
      <button
        onClick={verifierContenu}
        class={boutonStyle}
        style={{
          marginLeft: "1300px",
          position: "absolute",
          marginTop: "-225px",
        }}
        //disabled={!selectedRobot} // Désactiver le bouton si aucun robot n'est sélectionné
      >
        {boutonTexte}
      </button>
      <br></br>

      <br></br>
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
                  Robot
                </th>
                <th scope="col" style={{ width: "10%" }} className="px-6 py-3">
                  Heure
                </th>
                <th scope="col" style={{ width: "80%" }} className="px-6 py-3">
                  Message/Error
                </th>
              </tr>
            </thead>

            <tbody>
              {logList.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">{log.id}</td>
                  <td className="px-6 py-4">{log.time}</td>
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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}
