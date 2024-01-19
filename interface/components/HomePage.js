import React from 'react';
import AceEditor from 'react-ace';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';


import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

export default function HomePage(props) {
  const router = useRouter();
  function onChange(newValue) {
    console.log('change', newValue);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    console.log("Disconnected");
    router.push('/');
    
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
          editorProps={{ $blockScrolling: true }}
          className="aceEditor"
        />
      </div>
      <button onClick={handleLogout} className="logoutButton">
        Log Out
      </button>

      {/* Style your button accordingly */}
      <style jsx>{`
        .logoutButton {
          padding: 10px;
          margin: 10px;
          background-color: red;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
