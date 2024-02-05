// components/FileUpload.js
import React, { useState, useRef } from 'react';
import { Dropzone, FileMosaic } from "@files-ui/react";

export default function FileUpload({ serverIP, setServerIP, portIP, setPortIP }) {
  const scheme = serverIP === 'localhost' ? 'http' : 'https';
  const [files, setFiles] = React.useState([]);

  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  
    incommingFiles.forEach((fileObj) => {
      // Assurez-vous que fileObj est le File et non un objet personnalisé
      const file = fileObj.file ? fileObj.file : fileObj;
  
      const reader = new FileReader();
      reader.readAsText(file);
  
      reader.onload = (e) => {
        const fileContent = e.target.result;
  
        // Votre template
        const template = `#include <remotePi.h>
  
  void setup() {
    Serial.begin(115200);
    config.begin();
  }
  
  void loop() {
    config.handleClient();
    MDNS.update();
  }`;
  
        const lignesTemplate = template.split('\n');
        const templateEstPresent = lignesTemplate.every(ligne => fileContent.includes(ligne.trim()));
  
        if (!templateEstPresent) {
          alert("Le contenu du fichier doit au moins contenir le template de base.");
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
    const formData = new FormData();
    files.forEach((fileObj) => {
      // Vous devrez peut-être ajuster cette ligne pour accéder correctement à l'objet File, selon la structure des données de fileObj.
      const file = fileObj.file ? fileObj.file : fileObj; 
      formData.append("file", file);
    });
    formData.append("robotId", "6"); // Ajouter votre robotId ici

    try {
      const response = await fetch(`${scheme}://${serverIP}:${portIP}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (response.ok) {
        console.log("Fichier envoyé avec succès");
        alert("Votre code a été envoyé !");
        // Nettoyer l'état et l'UI si nécessaire
        setFiles([]);
      } else {
        console.log("Échec de l'envoi du fichier");
      }
    } catch (error) {
      console.log("Erreur lors de l'envoi du fichier", error);
    }
  }
  

  // Fonction pour gérer le changement de l'adresse IP du serveur
  const handleServerIPChange = (e) => {
    setServerIP(e.target.value);
    let ip = e.target.value;
    // Vérifier si la chaîne se termine par un slash et le supprimer
    if (ip.endsWith('/')) {
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
      <label>
        Server IP:
        <input type="text" value={serverIP} onChange={handleServerIPChange} />
      </label>
      <label>
        Server Port:
        <input type="number" value={portIP} onChange={handlePortIPChange} />
      </label>
       <Dropzone
       label={"Mets ton code ici 🚀"}
        onChange={updateFiles}
        value={files}
        accept={".ino"}
        maxFiles={1}
        uploadConfig={{
            url: `${scheme}://${serverIP}:${portIP}/upload`,
            method: "POST",
           headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          extraData :{"robotId":6},
        }),
            cleanOnUpload: true,
         }}
     >
       {files.map((file) => (
           <FileMosaic key={file.id} {...file} onDelete={removeFile} info preview/>
         ))}
     </Dropzone>
     <button onClick={customFileSend} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Envoyer le fichier
      </button>
    </div>
  );
}