import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase"; 
import styles from "../app/globals.css";

export default function Register() {
  const [name, setName] = useState("");
  const [prénom, setPrénom] = useState("");
  const [promotion, setPromotion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

   
    const validPromotions = ["ING5", "ING4", "ING3", "ING2", "ING1"];

    
    if (!validPromotions.includes(promotion)) {
      setError("La promotion doit être parmi les suivantes: ING5, ING4, ING3, ING2, ING1");
      return;
    }

    if (password !== verifyPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const { data_user_profiles, error: insertError } = await supabase
      .from("user_profiles")
      .insert([{ user_id: data.user.id, nom: name, prénom, promotion }])
      .single();
    if (insertError) {
      setError(insertError.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <Head>
        <title>Inscription - Remote-PI</title>
      </Head>
      <br></br>
      <br></br>
      <div className="flex justify-center items-center ">
        <form class="px-4" onSubmit={handleSignUp}>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="prenom"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Prénom
              </label>
              <input
                type="text"
                id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={prénom} onChange={(e) => setPrénom(e.target.value)}
              />
            </div>
            <div>
              <label
                for="nom"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nom
              </label>
              <input
                type="text"
                id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                for="promotion"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Promotion
              </label>
              <input
                type="text"
                id="company"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={promotion} onChange={(e) => setPromotion(e.target.value)}
              />
            </div>
            <div>
              <label
                for="TD"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                TD
              </label>
              <input
                type="text"
                id="TD"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
          </div>

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
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={email} onChange={(e) => setEmail(e.target.value)}
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
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div class="mb-6">
            <label
              for="confirm_password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirmez le mot de passe
            </label>
            <input
              type="password"
              id="confirm_password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <br></br>
          <div class="flex justify-center items-center">
            <button
              type="submit"
              class="text-white  bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              S&apos;INSCRIRE
            </button>{" "}
          </div>
        </form>{" "}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}