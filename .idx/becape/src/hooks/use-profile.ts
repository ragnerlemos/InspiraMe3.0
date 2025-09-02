
"use client";

import { useState, useEffect, useCallback } from "react";

const PROFILE_KEY = "quotevid_profile";

export interface ProfileData {
  username: string;
  social: string;
  photo: string | null;
  iconUrl: string;
  showIcon: boolean;
  showDate: boolean;
}

// Hook para gerenciar os dados do perfil do usuário usando o localStorage.
export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: "Seu Nome",
    social: "@seuusario",
    photo: null,
    iconUrl: '',
    showIcon: true,
    showDate: true,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega os dados do perfil do localStorage quando o hook é montado.
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        // Garante que os novos campos tenham valores padrão se não existirem no localStorage
        const loadedProfile = JSON.parse(storedProfile);
        const defaultState: ProfileData = {
          username: "Seu Nome",
          social: "@seuusario",
          photo: null,
          iconUrl: '',
          showIcon: true,
          showDate: true,
        };
        setProfile({ ...defaultState, ...loadedProfile });
      }
    } catch (error) {
      console.error("Failed to parse profile from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Função para atualizar e salvar o perfil.
  const updateProfile = useCallback((newProfileData: Partial<ProfileData>) => {
    setProfile((prevProfile) => {
      const updatedProfile = { ...prevProfile, ...newProfileData };
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
      } catch (error) {
        console.error("Failed to save profile to localStorage", error);
      }
      return updatedProfile;
    });
  }, []);

  return { profile, updateProfile, isLoaded };
};
