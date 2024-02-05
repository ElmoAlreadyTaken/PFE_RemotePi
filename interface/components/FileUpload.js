// components/FileUpload.js
import React, { useState, useRef } from "react";

export default function FileUpload({
  serverIP,
  setServerIP,
  portIP,
  setPortIP,
  selectedRobot,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Créez une référence pour l'input de fichier

  function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier l'extension du fichier
    const fileExtension = file.name.split(".").pop();
    if (fileExtension.toLowerCase() !== "ino") {
      alert("Seuls les fichiers .ino sont acceptés.");
      event.target.value = ""; // Réinitialiser la sélection de fichier
      return;
    }

    setSelectedFile(file); // Stocker le fichier sélectionné
  }

  async function sendFile() {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier avant d'envoyer.");
      return;
    }

    // Ici, vous pouvez inclure la logique de vérification du contenu du fichier
    // ou tout autre prétraitement nécessaire avant l'envoi

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("robotId", selectedRobot.id);

    try {
      // Déterminer le schéma en fonction de la valeur de serverIP
      const scheme = serverIP === "localhost" ? "http" : "https";

      const response = await fetch(`${scheme}://${serverIP}:${portIP}/upload`, {
        method: "POST",
        body: formData,
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });

      if (response.ok) {
        console.log("Fichier envoyé avec succès");
        // Traitement supplémentaire en cas de succès
      } else {
        console.log("Échec de l'envoi du fichier");
        // Gérer les erreurs ici
      }
    } catch (error) {
      console.log("Erreur lors de l'envoi du fichier", error);
      // Gérer les erreurs réseau ici
    }

    setSelectedFile(null); // Réinitialiser le fichier sélectionné après l'envoi
    if (fileInputRef.current) fileInputRef.current.value = "";
    alert("Votre code à été envoyé !");
  }

  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier l'extension du fichier
    const fileExtension = file.name.split(".").pop();
    if (fileExtension.toLowerCase() !== "ino") {
      alert("Seuls les fichiers .ino sont acceptés.");
      event.target.value = "";
      return;
    }

    // Lire le contenu du fichier
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async (e) => {
      const fileContent = e.target.result;

      // Votre template
      var template = `#include <espConfig.h>

    void setup() {
      Serial.begin(115200);
      config.begin();
    }

    void loop() {
      config.handleClient();
      MDNS.update();
    }`;
      const lignesTemplate = template.split("\n");
      const templateEstPresent = lignesTemplate.every((ligne) =>
        fileContent.includes(ligne.trim())
      );

      if (templateEstPresent) {
        // Créer un objet FormData et y ajouter le fichier
        const formData = new FormData();
        formData.append("file", file);
        formData.append("robotId", selectedRobot.id);
        console.log(formData);
        try {
          // Utiliser l'API Fetch pour envoyer le fichier au serveur
          const scheme = serverIP === "localhost" ? "http" : "https";

          const response = await fetch(
            `${scheme}://${serverIP}:${portIP}/upload`,
            {
              method: "POST",
              body: formData,
              headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
              }),
            }
          );

          if (response.ok) {
            console.log("Fichier envoyé avec succès");
            // Traitement supplémentaire en cas de succès
          } else {
            console.log("Échec de l'envoi du fichier");
            // Gérer les erreurs ici
          }
        } catch (error) {
          console.log("Erreur lors de l'envoi du fichier", error);
          // Gérer les erreurs réseau ici
        }
      } else {
        alert(
          "Le contenu du fichier doit au moins contenir le template de base."
        );
      }
    };
    reader.onerror = (error) => {
      console.log("Erreur lors de la lecture du fichier", error);
    };
  }

  // Fonction pour gérer le changement de l'adresse IP du serveur
  const handleServerIPChange = (e) => {
    setServerIP(e.target.value);
    let ip = e.target.value;
    // Vérifier si la chaîne se termine par un slash et le supprimer
    if (ip.endsWith("/")) {
      ip = ip.slice(0, -1);
    }
    setServerIP(ip);
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
      <input
        type="file"
        accept=".ino"
        onChange={handleFileSelection}
        ref={fileInputRef} // Utilisez la référence ici
      />
      <button
        onClick={sendFile}
        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Envoyer le fichier
      </button>
    </div>
  );
}
