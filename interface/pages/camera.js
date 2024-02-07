import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";


export default function MainComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAccountValidated, setIsAccountValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [logList, setLogList] = useState([]);
  const router = useRouter();
  const [isFileSent, setIsFileSent] = useState(false);
  const [selectedRobotIdForLogs, setSelectedRobotIdForLogs] = useState(null);

  const [blink, setBlink] = useState(false);
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState("");
  const [cameraPort, setCameraPort] = useState("");
  const [camStreamOn, setCamStreamOn] = useState(false);
  const [streamURL, setStreamURL] = useState("");
  const [baseURLServer, setbaseURLServer] = useState("");
  const [baseURLCamera, setbaseURLCamera] = useState("");
  const streamURLRef = useRef(streamURL);
  const isFirstRun = useRef(true);
  const clearLogs = () => {
    setLogList([]);
  };
  const handleFileSent = () => {
    setIsFileSent(true);
    fetchLogs();
  };
  const fetchLogs = async () => {
    try {
      if (!baseURLServer || !serverPort) return;
  
        const response = await fetch(
          `${baseURLServer}:${serverPort}/log`, {
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
  const handleRobotChangeFromUpload = (robot) => {
    setSelectedRobotIdForLogs(robot.id);
    console.log("robot camera:", robot);
  };
  const handlePreviousPage = () => {
    router.push("/configuration");
  };

  const handleNextPage = () => {
    router.push("/camera")
  };

  useEffect(() => {
    const checkSessionAndValidation = async () => {
      const { data: user } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user.user != null) {
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("validated")
          .eq("user_id", user.user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
        } else {
          setIsAccountValidated(profile.validated);
        }
      }
    };

    checkSessionAndValidation();

    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
      }
    });
  }, []);
  const checkStream = () => {
    console.log("[+] Checking the camera stream on :", streamURLRef.current);

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
    checkStream();
    const intervalId = setInterval(checkStream, 8000);

    return () => {
      console.log("Cleaning up the camera stream check...");
      clearInterval(intervalId);
    };
  }, [baseURLCamera, cameraPort]);

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
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLogs();
      console.log(selectedRobotIdForLogs);
    }, 2000); // Exécute `fetchLogs` toutes les 1000 millisecondes (1 seconde)
    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, [serverIp, serverPort, refreshKey]);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // Marque le premier rendu et empêche l'exécution ci-dessous
      return;
    }
    streamURLRef.current = `${baseURLCamera}:${cameraPort}/cam/`;
  }, [cameraPort, baseURLCamera]);

  if (!isLoggedIn) {
    return <>You have to log in to see this content.</>;
  }

  if (!isAccountValidated) {
    return <>You have to log in to see this content.</>;
  }

  return (
    <>
      <div className="flex items-center justify-center bg-gray-200">
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
      <div className="bg-gray-200">
        <div className="flex ">
          <div
            className="flex items-center justify-center overflow-hidden bg-white shadow-xl sm:rounded-lg "
            style={{
              height: "600px",
              width: "1040px",
              borderRadius: "20px",
              marginTop: "80px",
              marginLeft: "40px",
            }}
          >
            <div className="ml-1 streamContainer">
              {camStreamOn ? (
                <iframe
                  src={streamURLRef.current}
                  height="560"
                  width="1000"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen={true}
                ></iframe>
              ) : (
                <div>
                  <div style={{ color: "red" }}>
                  Erreur: Impossible de charger la caméra.</div>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex items-center justify-center overflow-hidden bg-white shadow-xl sm:rounded-lg "
            style={{
              height: "700px",
              width: "750px",
              borderRadius: "20px",
              marginTop: "20px",
              marginLeft: "40px",
            }}
          >
            <div
              class="relative overflow-x-auto shadow-md sm:rounded-lg"
              style={{
                height: "660px",
                width: "700px",
                marginTop: "-40px",
              }}
            >
              {errorMessage && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage}
                </div>
              )}
              <div>
                <br></br>
              </div>
              <div
                className="relative overflow-x-auto shadow-md sm:rounded-lg"
                style={{ maxHeight: "630px", overflowY: "auto" }}
              >
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th
                        scope="col"
                        style={{ width: "10%" }}
                        className="px-6 py-3"
                      >
                        Robot
                      </th>
                      <th
                        scope="col"
                        style={{ width: "10%" }}
                        className="px-6 py-3"
                      >
                        Heure
                      </th>
                      <th
                        scope="col"
                        style={{ width: "80%" }}
                        className="px-6 py-3"
                      >
                        Message/Error
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {logList.filter((log) => !selectedRobotIdForLogs || log.id === selectedRobotIdForLogs).map((log, index) => (
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
            </div>
          </div>
        </div>
        <button
          onClick={clearLogs}
          className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          style={{
            marginTop: "0px",
            marginLeft: "1450px",
          }}
        >
          Effacer
        </button>
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
        )}
        <div>
          <br></br>
        </div>
        {isFileSent && (
          <div
            className="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    style={{ width: "10%" }}
                    className="px-6 py-3"
                  >
                    Robot
                  </th>
                  <th
                    scope="col"
                    style={{ width: "10%" }}
                    className="px-6 py-3"
                  >
                    Heure
                  </th>
                  <th
                    scope="col"
                    style={{ width: "80%" }}
                    className="px-6 py-3"
                  >
                    Message/Error
                  </th>
                </tr>
              </thead>

              <tbody>
                {logList
                  
                  .map((log, index) => (
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
        )}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </>
  );
}
