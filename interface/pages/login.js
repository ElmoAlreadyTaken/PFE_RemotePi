import React, { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase"; // Assurez-vous que le chemin est correct
import styles from "../app/globals.css"; // Utilisez vos styles globaux ou CSS module

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/"); // Redirect to index
    }
  };
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "/update-password", // URL de redirection après la réinitialisation
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
    <div className="flex items-center justify-center ">
      <div className={styles.loginContainer}>
        <Head>
          <title>Connection - Remote-PI</title>
        </Head>
        <br></br> <br></br>
        <br></br>
        <form class="px-4" onSubmit={handleLogin} className={styles.loginForm}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div class="mb-6">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Adresse email{" "}
            </label>
            <input
              type="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-75 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div class="mb-6">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-75 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              class="text-blue-600 focus:outline-none text-xs"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <br></br>
          <button
            type="submit"
            class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            disabled={loading}
          >
            {loading ? "Chargement..." : "SE CONNECTER"}
          </button>

          <div className="text-xs" >
            Nouveau sur RemotePi ?
            <Link
              href="/register"
              class="text-blue-600 focus:outline-none text-xs px-1"
              disabled={loading}
            >
              S&apos;INSCRIRE
            </Link>
          </div>
          <br></br>

          {resetError && <p style={{ color: "red" }}>{resetError}</p>}
          {resetSuccess && (
            <p style={{ color: "green" }}>Email de réinitialisation envoyé</p>
          )}
        </form>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}
