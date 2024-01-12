// pages/login.js
import Head from 'next/head'
import Image from 'next/image'
import styles from '../app/globals.css' // This assumes you'll create a corresponding CSS module file.

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Login - Remote-PI</title>
      </Head>


      <form className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <input type="text" placeholder="Username" className={styles.inputField} />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="Password" className={styles.inputField} />
        </div>
        <button type="submit" className={styles.loginButton}>LOGIN</button>
        <a href="#" className={styles.signInLink}>sign-in</a>
      </form>
    </div>
  )
}
