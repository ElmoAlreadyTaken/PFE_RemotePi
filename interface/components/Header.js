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
                    <a href="/" class="logo">
                      .REMOTEPI
                    </a>
                    <ul class="nav">
                      <li class="scroll-to-section">
                        <a href="/">ACCUEIL</a>
                      </li>
                      <li class="scroll-to-section">
                        <a href="/about">à PROPOS</a>
                      </li>

                      {isLoggedIn ? (
                        <>
                          <li class="scroll-to-section">
                            <a href="/upload">téléverser</a>
                          </li>
                          <li class="scroll-to-section">
                            <a href="/profile">Profil</a>
                          </li>
                          <li class="scroll-to-section">
                            <a>
                              <button
                                class="scroll-to-section"
                                onClick={handleLogout}
                              >
                                DÉCONNEXION
                              </button>
                            </a>
                          </li>
                        </>
                      ) : (
                        <div>
                          <li class="scroll-to-section">
                            <a href="/login">SE CONNECTER</a>
                          </li>
                        </div>
                      )}

                      <div class="search-icon">
                        <a href="#search">
                          <i class="fa fa-search"></i>
                        </a>
                      </div>
                    </ul>
                    <a class="menu-trigger">
                      <span>Menu</span>
                    </a>
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
