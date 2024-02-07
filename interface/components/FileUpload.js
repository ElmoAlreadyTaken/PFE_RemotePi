import React, { useState, useEffect, useRef } from "react";
import { Dropzone, FileMosaic } from "@files-ui/react";
import { supabase } from "../lib/supabase";

export default function FileUpload({
  selectedRobot,
  onRobotChangeFromUpload,
  onFileSent,
}) {
  const [files, setFiles] = React.useState([]);
  const [baseURLServer, setbaseURLServer] = useState("");
  const [serverPort, setServerPort] = useState("");
  const [cameraPort, setCameraPort] = useState("");
  const [baseURLCamera, setbaseURLCamera] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("server_configurations")
        .select("*")
        .single();
      if (data) {
        console.log("Supabase Data : ", data);
        setbaseURLServer(data.baseURLServer);
        setbaseURLCamera(data.baseURLCamera);
        setServerPort(data.serverPort);
        setCameraPort(data.cameraPort);
      }
    };

    fetchConfig();
  }, []);

  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);

    incommingFiles.forEach((fileObj) => {
      const file = fileObj.file ? fileObj.file : fileObj;

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (e) => {
        const fileContent = e.target.result;

        const template = `#include <remotePi.h>
remotePi config;
void setup() {
  Serial.begin(115200);
  config.begin();
}

void loop() {
  config.handleClient();
}`;

        const lignesTemplate = template.split("\n");
        const templateEstPresent = lignesTemplate.every((ligne) =>
          fileContent.includes(ligne.trim())
        );

        /* if (!templateEstPresent) {
          alert(
            "Le contenu du fichier doit au moins contenir le template de base."
          );
          removeFile(file);
        }*/
      };

      reader.onerror = (error) => {
        console.log("Erreur lors de la lecture du fichier", error);
      };
    });
  };

  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  async function customFileSend() {
    if (!selectedRobot) {
      return;
    }
    setIsSending(true);
    const formData = new FormData();
    files.forEach((fileObj) => {
      const file = fileObj.file ? fileObj.file : fileObj;
      formData.append("file", file);
    });
    formData.append("robotId", selectedRobot.id);
    onRobotChangeFromUpload(selectedRobot);
    try {
      if (!baseURLServer || !serverPort) {
        console.log(
          "Erreur lors de l'envoi du fichier : pas de configuration de l'IP/PORT serveur"
        );
        return;
      }

      const response = await fetch(`${baseURLServer}:${serverPort}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (response.ok) {
        console.log("Fichier envoyé avec succès");
        alert("Votre code a été envoyé !");

        setFiles([]);
      } else {
        console.log("Échec de l'envoi du fichier");
      }
    } catch (error) {
      console.log("Erreur lors de l'envoi du fichier", error);
    }
    setIsSending(false);
  }

  return (
    <div>
      <div
        style={{
          pointerEvents: selectedRobot ? "auto" : "none",
          opacity: selectedRobot ? 1 : 0.6,
        }}
      >
        <Dropzone
          label={"Mets ton code ici 🚀"}
          onChange={updateFiles}
          value={files}
          accept={".ino,.bin"}
          maxFiles={1}
          uploadConfig={{
            url: `${baseURLServer}:${serverPort}/upload`,
            method: "POST",
            headers: new Headers({
              "ngrok-skip-browser-warning": "69420",
              extraData: { robotId: selectedRobot ? selectedRobot.id : null },
            }),
            cleanOnUpload: true,
          }}
        >
          {files.map((file) => (
            <FileMosaic
              key={file.id}
              {...file}
              onDelete={removeFile}
              info
              preview
            />
          ))}
        </Dropzone>
      </div>

      <button
        onClick={customFileSend}
        className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        disabled={isSending}
      >
        {isSending ? (
          <div className="flex items-center">Téléversement...</div>
        ) : (
          "Envoyer le fichier"
        )}
      </button>
    </div>
  );
}
