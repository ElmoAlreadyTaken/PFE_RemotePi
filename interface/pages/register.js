// pages/register.js
import Head from 'next/head';
import Image from 'next/image';
import styles from '../app/globals.css'; // Ensure this points to your CSS module file

export default function Register() {
  return (
    <>
      <Head>
        <title>Register - Remote-PI</title>
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nom</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">Mail</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="verify-password">Verify Password</label>
              <input type="password" id="verify-password" name="verify-password" required />
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
