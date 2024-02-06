import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";


export default function MainComponent() {
  const [errorMessage, setErrorMessage] = useState("");
  const [logList, setLogList] = useState([]);
  const router = useRouter();
  const [isFileSent, setIsFileSent] = useState(false);
  const clearLogs = () => {
    setLogList([]);
  };
  const handleFileSent = () => {
    setIsFileSent(true);
    fetchLogs(); // Appeler fetchLogs ici pour rafraîchir les logs après l'envoi du fichier
  };
  const handlePreviousPage = () => {
    router.push("/upload");
  };

  const handleNextPage = () => {
    router.push("/camera")
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
        <div className="bg-gray-200">
            <div className="flex ">
                <div
                    className="overflow-hidden bg-white flex justify-center items-center  shadow-xl sm:rounded-lg "
                    style={{
                        height: "600px",
                        width: "1040px",
                        borderRadius: "20px",
                        marginTop: "80px",
                        marginLeft: "40px",
                    }}
                >
                    <iframe
                        src="https://player.twitch.tv/?channel=otplol_&parent=localhost"
                        height="560"
                        width="1000"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen={true}
                    ></iframe>
                </div>

                <div
                    className="overflow-hidden bg-white flex justify-center items-center  shadow-xl sm:rounded-lg "
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
                            height: "800px",
                            width: "700px",
                            marginTop: "80px",
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
                                    {logList.map((log, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4">{log.id}</td>
                                            <td className="px-6 py-4">{log.time}</td>
                                            <td
                                                className={`px-6 py-4 ${log.error ? "text-red-500" : "text-black"
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
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                                .filter(
                                    (log) =>
                                        !selectedRobotIdForLogs ||
                                        log.id === selectedRobotIdForLogs
                                )
                                .map((log, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">{log.id}</td>
                                        <td className="px-6 py-4">{log.time}</td>
                                        <td
                                            className={`px-6 py-4 ${log.error ? "text-red-500" : "text-black"
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
        </>);
}
