import Head from 'next/head';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import styles from '../app/globals.css'; 

export default function Accueil() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Remote Pi</title>
        <meta name="description" content="Remote Pi Interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="Remote Pi Logo" width={150} height={150} />
          <h1 className={styles.title}>Remote Pi</h1>
        </div>
        <div className={styles.connectContainer}>
          <p className={styles.description}>
            Connectez to raspberry ou windows derriere le murve.
            Vous avez pas peur?
          </p>
          <div className={styles.buttons}>
            <button className={styles.button}>Se connecter</button>
            <button className={`${styles.button} ${styles.signupButton}`}>S&apos;inscrire</button>
          </div>
        </div>
      </main>
    </div>
  );
}
