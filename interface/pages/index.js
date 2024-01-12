import { supabase } from '../lib/supabase'
import FileUpload from '../components/FileUpload';
import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

export default function HomePage() {
  function onChange(newValue) {
    console.log('change', newValue);
  }

  return (
    <div className="aceEditorContainer">
      <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        className="aceEditor"
      />
    </div>
  );
}
