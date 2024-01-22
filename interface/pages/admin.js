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
      <h1>Administration - Gestion des inscriptions</h1>
      <ul>
        {userList.map(user => (
          <li key={user.id}>
            {user.nom} {"  "} {user.prénom} {"  "} {user.promotion} - <button onClick={() => validateUser(user.id)}>Valider</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
