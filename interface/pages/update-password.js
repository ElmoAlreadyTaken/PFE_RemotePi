import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function UpdatePassword() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        const newPassword = prompt("Quel doit être votre nouveau mot de passe ?");
        const { data, error } = await supabase.auth
          .updateUser({ password: newPassword });

        if (data) {
          alert("Mot de passe mis à jour avec succès !");
          router.push('/login');
        }
        if (error) {
          alert("Une erreur s'est produite lors de la mise à jour de votre mot de passe.");
          setMessage(error.message);
        }
      }
    });
  }, [router]);

  return (
    <div>
      <h1>Réinitialiser le Mot de Passe</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
