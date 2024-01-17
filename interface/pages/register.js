import React, { useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabase'; // Ensure the path is correct
import styles from '../app/globals.css'; // Ensure this points to your CSS module file

export default function Register() {
  const [name, setName] = useState('');
  const [prénom, setPrénom] = useState('');
  const [promotion, setPromotion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== verifyPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    const { user, error: signUpError } = await supabase.auth.signUp({ email, password, options:{name,prénom,promotion,verifyPassword}});
    
    if (signUpError) {
      setError(signUpError.message);
      return;
    }else if (user) {
      console.log('User:', user);
    }

    const { data, error: insertError } = await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id, nom: name, prénom, promotion }])
      .single();

    if (insertError) {
      setError(insertError.message);
    } else {
      console.log('User created:', data);
      // Redirect or handle the successful sign-up
    }
  };

  return (
    <>
      <Head>
        <title>Register - Remote-PI</title>
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <form onSubmit={handleSignUp} className={styles.form}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nom : </label>
              <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="prénom">Prénom : </label>
              <input type="text" id="prénom" name="prénom" required value={prénom} onChange={(e) => setPrénom(e.target.value)} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="promotion">Promotion : </label>
              <input type="text" id="promotion" name="promotion" required value={promotion} onChange={(e) => setPromotion(e.target.value)} />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">Mail : </label>
              <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password : </label>
              <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="verify-password">Verify Password : </label>
              <input type="password" id="verify-password" name="verify-password" required value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} />
            </div>

            <div className={styles.submitGroup}>
              <button type="submit" className={styles.submitButton}>Sign Up</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
