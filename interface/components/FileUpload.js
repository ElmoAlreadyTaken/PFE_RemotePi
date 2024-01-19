// components/FileUpload.js
export default function FileUpload() {
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Créer un objet FormData et y ajouter le fichier
    const formData = new FormData();
    formData.append("file", file);

    // Adresse IP du serveur
    const serverIP = "4.tcp.eu.ngrok.io"; // Remplacez par votre adresse IP
    const portIP = 17707; // Remplacez par le port

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

  return (
    <div>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
