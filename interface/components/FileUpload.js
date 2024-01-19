// components/FileUpload.js
import React, { useState } from 'react';

export default function FileUpload() {
  const [serverIP, setServerIP] = useState('4.tcp.eu.ngrok.io'); // Nouvelle adresse IP du serveur
  const [portIP, setPortIP] = useState(17707); // Nouveau port

  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

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
        console.error("Échec de l'envoi du fichier");
        // Gérer les erreurs ici
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier", error);
      // Gérer les erreurs réseau ici
    }
  }

  // Fonction pour gérer le changement de l'adresse IP du serveur
  const handleServerIPChange = (e) => {
    setServerIP(e.target.value);
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
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
