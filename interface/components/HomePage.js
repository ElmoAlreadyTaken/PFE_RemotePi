import React, { useEffect, useState, useRef } from "react";
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
  const router = useRouter();
  const [serverIp, setServerIp] = useState("localhost"); // Nouvelle adresse IP du serveur
  const [serverPort, setServerPort] = useState("");
  const [cameraPort, setCameraPort] = useState("");
  const [camStreamOn, setCamStreamOn] = useState(false);
  const [streamURL, setStreamURL] = useState(""); // Initial URL or default value
  const [baseURLServer, setbaseURLServer] = useState("");
  const [baseURLCamera, setbaseURLCamera] = useState("");
  const [selectedRobotIdForLogs, setSelectedRobotIdForLogs] = useState(null);
  const streamURLRef = useRef(streamURL);
  const [isFileSent, setIsFileSent] = useState(false);

  const handleFileSent = () => {
    setIsFileSent(true);
    fetchLogs(); // Appeler fetchLogs ici pour rafraîchir les logs après l'envoi du fichier
  };

  const handleRobotChangeFromUpload = (robot) => {
    setSelectedRobotIdForLogs(robot.id);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("server_configurations")
        .select("*")
        .single();
      if (data) {
        setbaseURLServer(data.baseURLServer);
        setbaseURLCamera(data.baseURLCamera);
        setServerPort(data.serverPort);
        setCameraPort(data.cameraPort);
      }
    };

    fetchConfig();
  }, []);
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

  const handleSelectedRobotChange = (newSelectedRobot) => {
    setSelectedRobot(newSelectedRobot);
    // Vous pouvez effectuer d'autres actions en fonction de la nouvelle valeur de selectedRobot
  };
  var template = `#include <remotePi.h>
  remotePi config;
  void setup() {
    Serial.begin(115200);
    config.begin();
  }

  void loop() {
    config.handleClient();
  }`;
  const [editorContent, setEditorContent] = useState(template);
  const [boutonStyle, setBoutonStyle] = useState(
    "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
  );
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [boutonTexte, setBoutonTexte] = useState("Téléverser");
  const [isAllRobotsVisible, setAllRobotsVisibility] = useState(false);

  const fetchLogs = async () => {
    try {
      if (!baseURLServer || !serverPort) return;

      const response = await fetch(`${baseURLServer}:${serverPort}/log`, {
        method: "GET",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
      if (!response.ok) {
        throw new Error("Serveur indisponible"); // Peut indiquer une erreur 4XX/5XX
      }
      const log = await response.json();
      console.log(log);
      const newLogList = Array.isArray(log) ? log : [log];
      setLogList((prevLogList) => [...prevLogList, ...newLogList]);
      setErrorMessage(""); // Réinitialiser le message d'erreur en cas de succès
    } catch (error) {
      console.error(error); // Conserver pour le debug, mais vous pourriez vouloir le retirer en production
      setErrorMessage("Serveur indisponible."); // Utiliser un message générique pour l'utilisateur
    }
  };

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
    if (templateEstPresent && selectedRobot) {
      setBoutonStyle(
        "text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      );
      setBoutonTexte("Téléverser");
    } else {
      setBoutonStyle(
        "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      );
      setBoutonTexte("Doit contenir le template et sélectionner un robot");
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
      console.log("ip : ", serverIp, "port :", serverPort);
      try {
        // Créer un Blob avec le contenu de l'éditeur
        const blob = new Blob([editorContent], { type: "text/plain" });

        // Créer un objet FormData et y ajouter le Blob en tant que fichier
        const formData = new FormData();
        formData.append("file", blob, "monFichier.ino");

        // Utiliser l'API Fetch pour envoyer le fichier au serveur
        // Déterminer le schéma en fonction de la valeur de serverIP
        if (!baseURLServer || !serverPort) return;

        const response = await fetch(`${baseURLServer}:${serverPort}/upload`, {
          method: "POST",
          body: formData,
        });

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

  const checkStream = () => {
    console.log("[+] Checking the camera stream on :", streamURLRef.current);

    // Start fetching the stream with the updated streamURL
    fetch(streamURLRef.current, {
      method: "OPTIONS",
      cache: "no-cache",
      signal: AbortSignal.timeout(3000),
    })
      .then((response) => {
        if (response.status === 200 || response.status === 204) {
          setCamStreamOn(true);
          console.log("[+] CAMERA STREAM IS ON !!");
          console.log(
            "Response Status :",
            response.status,
            response.statusText
          );
        } else {
          console.log(
            "[-] ERROR Status :",
            response.status,
            response.statusText
          );
          throw new Error("Stream not available");
        }
      })
      .catch(() => {
        console.log("[-] Error : no camera stream available");
        setCamStreamOn(false);
      });
  };

  useEffect(() => {
    streamURLRef.current = `${baseURLCamera}:${cameraPort}/cam/`;
  }, [cameraPort, baseURLCamera]); // Update refs when state changes

  useEffect(() => {
    const intervalId = setInterval(() => {
      //fetchLogs();
    }, 2000); // Exécute `fetchLogs` toutes les 1000 millisecondes (1 seconde)

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, [serverIp, serverPort, refreshKey]); // Les dépendances assurent que l'intervalle est réinitialisé si `serverIp` ou `serverPort` changent

  useEffect(() => {
    // Check the stream immediately and then every 10 seconds
    checkStream(); // Initial check
    const intervalId = setInterval(checkStream, 8000);

    // Clean up
    return () => {
      console.log("Cleaning up the camera stream check...");
      clearInterval(intervalId);
    };
  }, [baseURLCamera, cameraPort]); // Needed to re-run the effect when the server IP or port changes
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handlePreviousPage = () => {
    router.push("/upload");
  };

  const handleNextPage = () => {
    router.push("camera")
  };

    return (
      <>
      <div className="bg-gray-200 flex justify-center items-center">
        <div
          style={{
            display: "flex",
            marginRight: "50px",
            marginTop: "5px",
          }}
        >
          <button onClick={handlePreviousPage}>Configuration</button>
        </div>
        <div
          style={{
            display: "flex",
            marginRight: "50px",
            marginTop: "5px",
          }}
        >
          <button onClick={handleNextPage}>Caméra</button>
        </div>
      </div>

      <div className="bg-gray-200 " style={{ height: "calc(100vh - 100px)" }}>
        <div className="flex">
          <br></br>
          <div
            className="overflow-hidden bg-white shadow-xl sm:rounded-lg "
            style={{
              height: isAllRobotsVisible ? "400px" : "150px",
              width: "560px",
              borderRadius: "20px",
              marginTop: "225px",
              marginLeft: "40px",
              transition: "height 0.5s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="freeRobotsContainer"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "100px",
                  marginTop: "45px",
                }}
              >
                <FreeRobots
                  key={refreshKey}
                  onSelectedRobotChange={handleSelectedRobotChange}
                />
              </div>
              <img
                src="refresh-icon.png"
                alt="Refresh Icon"
                onClick={refreshComponents}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "30px",
                  marginTop: "30px",
                  cursor: "pointer",
                  width: "35px",
                  height: "35px",
                  animation: blink ? "blink 1s" : "none", // Appliquer l'animation si le clignotement est activé
                }}
              />{" "}
            </div>

            <div>
              <button
                onClick={toggleAllRobotsVisibility}
                style={{
                  marginLeft: "200px",
                }}
              >
                {isAllRobotsVisible
                  ? "Masquer les robots"
                  : "Afficher les robots"}
              </button>
              {isAllRobotsVisible && (
                <div
                  className="AllRobotsContainer "
                  style={{
                    marginLeft: "100px",
                  }}
                >
                  <br></br>
                  <AllRobots />
                </div>
              )}
            </div>
          </div>
          <div
            className="overflow-hidden bg-white shadow-xl sm:rounded-lg flex justify-center items-center "
            style={{
              height: "700px",
              width: "600px",
              borderRadius: "20px",
              marginTop: "30px",
              marginLeft: "40px",
            }}
          >
            <div className="aceEditorContainer ml-2">
              <AceEditor
                mode="c_cpp"
                theme="monokai"
                onChange={onChange}
                name="UNIQUE_ID_OF_DIV"
                value={editorContent}
                editorProps={{ $blockScrolling: true }}
                className="aceEditor"
                style={{
                  height: "650px",
                  width: "550px",
                  marginRight: "6px",
                }}
              />
            </div>{" "}
          </div>
          <br></br>{" "}
          <div
            className="overflow-hidden bg-white shadow-xl sm:rounded-lg "
            style={{
              height: "300px",
              width: "550px",
              borderRadius: "20px",
              marginTop: "150px",
              marginLeft: "40px",
            }}
          >
            <div className="flex items-center justify-center">
              <div
                className="fileUploadContainer"
                style={{
                  height: "40px",
                  width: "400px",
                  marginTop: "35px",
                }}
              >
                <FileUpload
                  selectedRobot={selectedRobot}
                  onRobotChangeFromUpload={handleRobotChangeFromUpload}
                  onFileSent={handleFileSent}
                />
              </div>{" "}
            </div>

            <br></br>

            <br></br>
          </div>
        </div>
        <button
          onClick={verifierContenu}
          class={boutonStyle}
          style={{
            marginLeft: "675px",
            marginTop: "20px",
          }}
          disabled={!selectedRobot} // Désactiver le bouton si aucun robot n'est sélectionné
        >
          {boutonTexte}
        </button>
      </div>
      </>);
  }

