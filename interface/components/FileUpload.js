// components/FileUpload.js
import React, { useState } from 'react';

export default function FileUpload({ serverIP, setServerIP, portIP, setPortIP }) {
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier l'extension du fichier
  const fileExtension = file.name.split('.').pop();
  if (fileExtension.toLowerCase() !== "ino") {
    alert("Seuls les fichiers .ino sont acceptés.");
    event.target.value = '';
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
    const lignesTemplate = template.split('\n');
    const templateEstPresent = lignesTemplate.every(ligne => fileContent.includes(ligne.trim()));

    if (templateEstPresent) {
      alert("La configuration ESP est présente dans le contenu.");
      // Créer un objet FormData et y ajouter le fichier
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Utiliser l'API Fetch pour envoyer le fichier au serveur
        const response = await fetch(`http://${serverIP}:${portIP}/upload`, {
          method: "POST",
          body: formData,
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
    }else {
      alert("Le contenu du fichier doit au moins contenir le template de base.");
    }
  }; reader.onerror = (error) => {
    console.log("Erreur lors de la lecture du fichier", error);
  };
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
      <input type="file" accept=".ino"  onChange={handleUpload} />
    </div>
  );
}
