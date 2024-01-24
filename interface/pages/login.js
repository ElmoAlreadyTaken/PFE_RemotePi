import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../lib/supabase'; // Assurez-vous que le chemin est correct
import styles from '../app/globals.css'; // Utilisez vos styles globaux ou CSS module

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    else {
      router.push('/');// Redirect to index
    }
  };
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'http://localhost:3000/update-password', // URL de redirection après la réinitialisation
      });
  
      if (error) {
        throw error;
      }
  
      setResetSuccess(true);
    } catch (error) {
      setResetError(error.message);
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Login - Remote-PI</title>
      </Head>

      <form onSubmit={handleLogin} className={styles.loginForm}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email: </label>
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Mot de passe: </label>
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? 'Chargement...' : 'LOGIN'}
        </button>
        <a href="register" className={styles.signInLink}>sign-in</a>
        <div>
          <input
            type="email"
            placeholder="Email pour réinitialiser le mot de passe"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            Réinitialiser le Mot de Passe
          </button>
          {resetError && <p style={{ color: 'red' }}>{resetError}</p>}
          {resetSuccess && <p style={{ color: 'green' }}>Email de réinitialisation envoyé</p>}
        </div>
      </form>
    </div>
  );
}
