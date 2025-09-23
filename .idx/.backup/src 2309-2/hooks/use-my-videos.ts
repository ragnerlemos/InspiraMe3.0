
"use client";

import { useState, useEffect, useCallback } from "react";
import type { EditorState } from "@/app/editor-de-video/tipos";

const MY_VIDEOS_KEY = "quotevid_my_videos";

// Define o tipo localmente para evitar importações cruzadas
export interface SavedVideo {
  id: string;
  thumbnail: string;
  editorState: EditorState;
  createdAt: string;
}

// Hook para gerenciar os vídeos salvos usando o localStorage.
export const useMyVideos = () => {
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);

  // Carrega os vídeos salvos do localStorage.
  useEffect(() => {
    try {
      const storedVideos = localStorage.getItem(MY_VIDEOS_KEY);
      if (storedVideos) {
        setSavedVideos(JSON.parse(storedVideos));
      }
    } catch (error) {
      console.error("Failed to parse saved videos from localStorage", error);
      setSavedVideos([]);
    }
  }, []);

  // Salva a lista de vídeos no localStorage.
  const saveVideos = useCallback((videos: SavedVideo[]) => {
    try {
      localStorage.setItem(MY_VIDEOS_KEY, JSON.stringify(videos));
    } catch (error) {
        console.error("Failed to save videos to localStorage", error);
    }
  }, []);

  // Adiciona um novo vídeo à lista.
  const addVideo = useCallback((video: SavedVideo) => {
    setSavedVideos((prevVideos) => {
        const newVideos = [video, ...prevVideos];
        saveVideos(newVideos);
        return newVideos;
    });
  }, [saveVideos]);

  // Remove um vídeo da lista.
  const removeVideo = useCallback((id: string) => {
    setSavedVideos((prevVideos) => {
        const newVideos = prevVideos.filter((video) => video.id !== id);
        saveVideos(newVideos);
        return newVideos;
    });
  }, [saveVideos]);

  return { savedVideos, addVideo, removeVideo };
};
