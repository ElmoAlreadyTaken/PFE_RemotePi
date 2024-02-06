import React, { useState, useEffect, useRef } from "react";
import { Dropzone, FileMosaic } from "@files-ui/react";
import { supabase } from "../lib/supabase";

export default function FileUpload({selectedRobot, onRobotChangeFromUpload,onFileSent,}) {
  
  const [files, setFiles] = React.useState([]);
  const [baseURLServer, setbaseURLServer] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [cameraPort, setCameraPort] = useState('');
  const [baseURLCamera, setbaseURLCamera] = useState('');


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

        if (!templateEstPresent) {
          alert(
            "Le contenu du fichier doit au moins contenir le template de base."
          );
          removeFile(file);
        }
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

    const formData = new FormData();
    files.forEach((fileObj) => {
    
      const file = fileObj.file ? fileObj.file : fileObj;
      formData.append("file", file);
    });
    formData.append("robotId", selectedRobot.id);

    try {
      if (!baseURLServer || !serverPort) return;
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
          accept={".ino"}
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
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Envoyer le fichier
      </button>
    </div>
  );
}
