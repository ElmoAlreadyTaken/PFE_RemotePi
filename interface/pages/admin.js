import React, { useState, useEffect } from 'react';
  import { supabase } from '../lib/supabase';
  import { useRouter } from 'next/router';

  export default function AdminPage() {
    const [userList, setUserList] = useState([]);
    const [baseURLServer, setbaseURLServer] = useState('');
    const [baseURLCamera, setbaseURLCamera] = useState('');
    const [CameraPort, setCameraPort] = useState('');
    const [ServerPort, setServerPort] = useState('');

    const router = useRouter();

    useEffect(() => {
      const checkAdmin = async () => {
        const user = supabase.auth.getUser();
        if (!user) {
          router.push('/');
        }
        const { data, error } = await supabase
          .from('user_profiles')
          .select()
          .eq("user_id", (await user).data.user.id);
      if (error) {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
          }
      if(!data[0].is_admin)
      {
          router.push('/');
      }

        
      };
      checkAdmin();
    }, [router]);

    useEffect(() => {
      const getUnvalidatedUsers = async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('validated', false); 

        if (error) {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
        } else {
          setUserList(data || []);
        }
      };

      getUnvalidatedUsers();
    }, []);

    const validateUser = async (userId) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ validated: true })
        .eq('id', userId);

      if (error) {
        console.error("Erreur lors de la validation de l'utilisateur:", error);
      } else {
  
        setUserList(userList.filter(user => user.id !== userId));
      }
    };
    const idUnique = 1;
    const updateServerConfig = async () => {
      const { data, error } = await supabase
        .from('server_configurations')
        .update({ baseURLServer: baseURLServer, serverPort: ServerPort, cameraPort:CameraPort, baseURLCamera : baseURLCamera })
        .eq('id', idUnique);
    
      if (error) {
        console.error('Erreur lors de la mise à jour de la configuration:', error);
      } else {
        alert('Configuration mise à jour avec succès!');
        
      }
    };
    useEffect(() => {
      const fetchConfig = async () => {
        const { data, error } = await supabase
          .from('server_configurations') 
          .select('*')
          .single(); 
  
        if (error) {
          console.error('Erreur lors de la récupération des configurations:', error);
        } else if (data) {
          setbaseURLServer(data.baseURLServer);
          setbaseURLCamera(data.baseURLCamera);
          setServerPort(data.serverPort); 
          setCameraPort(data.cameraPort);
        }
      };
  
      fetchConfig();
    }, []);
  
    
    return (
      <div>
        <br></br>
        <br></br>
        <h1>Administration - Gestion des inscriptions</h1>
        <br></br>
        <br></br>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Nom
                </th>
                <th scope="col" class="px-6 py-3">
                  Prénom
                </th>
                <th scope="col" class="px-6 py-3">
                  Promotion
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.map(user => (
                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={user.id}>
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.nom}
                  </th>
                  <td class="px-6 py-4">
                    {user.prénom}
                  </td>
                  <td class="px-6 py-4">
                    {user.promotion}
                  </td>
                  <td class="px-6 py-4">
                    <button onClick={() => validateUser(user.id)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      Valider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br> <br></br>
        <div>
          <h2>Modifier IP Serveur et Port</h2> <br></br>
          <label>URL du site : </label>
          <input
            type="text"
            placeholder="Server IP"
            value={baseURLServer}
            onChange={(e) => setbaseURLServer(e.target.value)}
          />
          <label>Port du serveur : </label>
          <input
            type="text"
            placeholder="Serveur Port"
            value={ServerPort}
            onChange={(e) => setServerPort(e.target.value)}
          />
          <label>URL de la camera : </label>
          <input
            type="text"
            placeholder="Camera URL"
            value={baseURLCamera}
            onChange={(e) => setbaseURLCamera(e.target.value)}
          />
          <label>port caméra : </label>
          <input
            type="text"
            placeholder="Camara Port"
            value={CameraPort}
            onChange={(e) => setCameraPort(e.target.value)}
          />
          <button onClick={updateServerConfig} className = "text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Mettre à jour</button>
        </div>

        <br></br><br></br><br></br><br></br>
      </div>
    );
  }
