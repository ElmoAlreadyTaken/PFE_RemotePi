import { supabase } from '../lib/supabase'
import FileUpload from '../components/FileUpload';

export default function HomePage() {
  async function fetchData() {
    let { data, error } = await supabase.from('test_table').select('*')
    if (data) {
      console.log(data)
    } else {
      console.error(error)
    }
  }

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <FileUpload />
    </div>
  );
}
