import React from 'react';
import AceEditor from 'react-ace';
import { supabase } from '../lib/supabase';
import FileUpload from '../components/FileUpload';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

export default function HomePage() {
  function onChange(newValue) {
    console.log('change', newValue);
  }

  return (
    <div className="container">
      <div className="streamContainer">
      <iframe
        src="https://player.twitch.tv/?channel=domingo&parent=localhost"
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
    </div>
  );
}
