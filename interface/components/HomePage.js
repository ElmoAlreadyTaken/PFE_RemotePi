import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';


import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

export default function HomePage(props) {
  const [websocketData, setWebsocketData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Remplacez 'wss://votre_adresse_ip_publique' par l'adresse de votre WebSocket
    const ws = new WebSocket('wss://4.tcp.eu.ngrok.io:17707');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setWebsocketData(message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    // Nettoyer la connexion WebSocket lorsque le composant est démonté
    return () => {
      ws.close();
    };
  }, []);

  function onChange(newValue) {
    console.log('change', newValue);
  }


  return (
    <div className="container">
      <div className="streamContainer">
        <iframe
          src="https://player.twitch.tv/?channel=otplol_&parent=localhost"
          height="720"
          width="1280"
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}>
        </iframe>
      </div>
      <div className="fileUploadContainer">
        <FileUpload />
      </div>
      {websocketData && (
        <div>
          {/* Afficher les données reçues via WebSocket */}
          <label>Données WebSocket: {JSON.stringify(websocketData)}</label>
        </div>
      )}
      <div className="aceEditorContainer">
        <AceEditor
          mode="c_cpp"
          theme="monokai"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          className="aceEditor"
        />
      </div>

    </div>
  );
}
