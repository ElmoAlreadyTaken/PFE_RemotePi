// components/FileUpload.js
export default function FileUpload() {
    async function handleUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      // Logique d'upload ici
      console.log("Uploading", file.name);
      // ... upload to Supabase Storage
    }
  
    return (
      <div>
        <input type="file" onChange={handleUpload} />
      </div>
    );
  }
  