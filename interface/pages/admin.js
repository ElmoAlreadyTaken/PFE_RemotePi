// pages/admin.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const [userList, setUserList] = useState([]);
  const router = useRouter();

  // Rediriger si l'utilisateur n'est pas admin
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

    console.log("user",data);
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

  // Récupérer les utilisateurs non validés
  useEffect(() => {
    const getUnvalidatedUsers = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('validated', false); // Supposons qu'il y ait une colonne 'validated'

      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } else {
        setUserList(data || []);
      }
    };

    getUnvalidatedUsers();
  }, []);

  // Valider un utilisateur
  const validateUser = async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ validated: true })
      .eq('id', userId);

    if (error) {
      console.error("Erreur lors de la validation de l'utilisateur:", error);
    } else {
      // Mettre à jour la liste des utilisateurs
      setUserList(userList.filter(user => user.id !== userId));
    }
  };

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
      <br></br><br></br><br></br><br></br>
    </div>
  );
}
