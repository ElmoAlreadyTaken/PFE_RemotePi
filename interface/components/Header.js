import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabase";

import "../assets/css/bootstrap.min.css";
import "../assets/css/font-awesome.css";
import "../assets/css/templatemo-breezed.css";

export default function Header({ theme, setTheme }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };
  return (
    <>
      <header class="header-container">
        <nav class="flex items-center ">
          <header class="header-area header-sticky">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <nav class="main-nav">
                    <Link href="/" class="logo">
                      .REMOTEPI
                    </Link>
                    <ul class="nav">
                      <li class="scroll-to-section">
                        <Link href="/">ACCUEIL</Link>
                      </li>
                      <li class="scroll-to-section">
                        <Link href="/about">à PROPOS</Link>
                      </li>

                      {isLoggedIn ? (
                        <>
                          <li class="scroll-to-section">
                            <Link href="/upload">téléverser</Link>
                          </li>
                          <li class="scroll-to-section">
                            <Link href="/profile">Profil</Link>
                          </li>
                          <li class="scroll-to-section">
                            <Link href='/'>
                              <button
                                class="scroll-to-section"
                                onClick={handleLogout}
                              >
                                DÉCONNEXION
                              </button>
                            </Link>
                          </li>
                        </>
                      ) : (
                        <div>
                          <li class="scroll-to-section">
                            <Link href="/login">SE CONNECTER</Link>
                          </li>
                        </div>
                      )}

                      <div class="search-icon">
                        <Link href="/">
                          <i class="fa fa-search"></i>
                        </Link>
                      </div>
                    </ul>
                    <Link href="/" class="menu-trigger">
                      <span>Menu</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </header>
        </nav>
      </header>
    </>
  );
}
