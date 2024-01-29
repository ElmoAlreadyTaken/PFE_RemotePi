import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';


import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

export default function HomePage(props) {
  var template = `#include <espConfig.h>

  void setup() {
    Serial.begin(115200);
    config.begin();
  }

  void loop() {
    config.handleClient();
    MDNS.update();
  }`;
  const router = useRouter();
  const [editorContent, setEditorContent] = useState(template)
  const [boutonStyle, setBoutonStyle] = useState("text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700");
  const [boutonTexte, setBoutonTexte] = useState("Téléverser");

  useEffect(() => {
    // Diviser le template en lignes ou en éléments clés
    const lignesTemplate = template.split('\n');
    // Vérifier si chaque ligne du template est présente dans le contenu de l'éditeur
    const templateEstPresent = lignesTemplate.every(ligne => editorContent.includes(ligne.trim()));
    if (templateEstPresent) {
      setBoutonStyle("text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2");
      setBoutonTexte("Téléverser");
    } else {
      setBoutonStyle("text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700");
      setBoutonTexte("Doit contenir le template");
    }
  }, [editorContent]);
  
  const verifierContenu = () => {
    // Diviser le template en lignes ou en éléments clés
    const lignesTemplate = template.split('\n');
    // Vérifier si chaque ligne du template est présente dans le contenu de l'éditeur
    const templateEstPresent = lignesTemplate.every(ligne => editorContent.includes(ligne.trim()));
    if (templateEstPresent) {
      alert("La configuration ESP est présente dans le contenu.");
      } else {
      alert("Le contenu de l'éditeur doit au moins contenir le template de base.");
      }
  };
  

  const onChange = (newValue) => {
    setEditorContent(newValue);
  };


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
      <div className="aceEditorContainer">
        <AceEditor
          mode="c_cpp"
          theme="monokai"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          value={editorContent}
          editorProps={{ $blockScrolling: true }}
          className="aceEditor"
        />
      </div>
      <br></br>
      
      <button onClick={verifierContenu} class={boutonStyle}>
        {boutonTexte}
        </button>
    </div>
  );
}
