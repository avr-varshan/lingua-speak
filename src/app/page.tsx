"use client";
import "regenerator-runtime/runtime";
import React, { useState, ChangeEvent } from "react";
import { IconCopy, IconStar, IconVolume } from "@tabler/icons-react";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";
import TextArea from "@/components/Inputs/TextArea";
import FileUpload from "@/components/Inputs/FileUpload";
import LinkPaste from "@/components/Inputs/LinkPaste";
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";
import { rtfToText } from "@/utils/rtfToText";
import { Player } from "@lottiefiles/react-lottie-player";


const Home: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [languages] = useState<string[]>(["Sanskrit", "English", "Tamil"]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("sanskrit");
  const [character, setCharacter] = useState<string>("idle");

  const { targetText, pronunciationText } = useTranslate(
    sourceText,
    selectedLanguage
  );

  // Mapping character states to JSON sources
  const characterSources: { [key: string]: string } = {
    idle: "/idle.json",
    speak: "/speak.json",
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rtfContent = reader.result as string;
        const text = rtfToText(rtfContent);
        setSourceText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleLinkPaste = async (e: ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    try {
      const response = await fetch(link);
      const data = await response.text();
      setSourceText(data);
    } catch (error) {
      console.error("Error fetching link content:", error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      localStorage.setItem("favoriteTranslation", targetText);
    } else {
      localStorage.removeItem("favoriteTranslation");
    }
  };

  const handleAudioPlayback = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.5;

    // Define a function to set the voice and start speaking
    const speakWithVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((voice) => voice.lang === "hi-IN");

      // Set the selected voice, or use the default voice if no match is found
      utterance.voice = selectedVoice || voices[0];

      // Log when playback starts
      utterance.onstart = () => {
        setCharacter("speak");
        console.log("Audio playback started");
      };

      // Log when playback ends
      utterance.onend = () => {
        setCharacter("idle");
        console.log("Audio playback ended");
      };

      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are already loaded, otherwise listen for the voiceschanged event
    if (window.speechSynthesis.getVoices().length !== 0) {
      speakWithVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = speakWithVoice;
    }
  };

  return (
    <div className="w-full bg-black bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] "></div>

      <div className="relative overflow-hidden h-screen">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
          <div className="text-center pt-[80px]">
            <h1 className="text-4xl sm:text-6xl font-bold  text-neutral-200">
              Lingua<span className="text-[#f87315]">Speak</span>
            </h1>

            <p className="mt-3 text-neutral-400 pb-11">
              LinguaSpeak: Bridging Voices, Connecting Worlds.
            </p>

            <div className="grid grid-cols-10">
              <div className="mt-0 mx-auto max-w-3xl relative col-span-7 ">
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <div className="relative z-10 flex flex-col space-x-3 p-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                    <TextArea
                      id="source-language"
                      value={sourceText}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setSourceText(e.target.value)
                      }
                      placeholder="Source Language"
                    />
                    <div className="flex flex-row justify-between w-full">
                      <span className="cursor-pointer flex space-x-2 flex-row">
                        <SpeechRecognitionComponent
                          setSourceText={setSourceText}
                        />
                        <IconVolume
                          size={22}
                          onClick={() => handleAudioPlayback(sourceText)}
                        />
                        <FileUpload handleFileUpload={handleFileUpload} />
                        <LinkPaste handleLinkPaste={handleLinkPaste} />
                      </span>
                      <span className="text-sm pr-4">
                        {sourceText.length} / 2000
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col space-x-3 p-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                    <TextArea
                      id="target-language"
                      value={targetText}
                      onChange={() => {}}
                      placeholder="Target Language"
                    />
                    <div className="flex flex-row justify-between w-full">
                      <span className="cursor-pointer flex items-center space-x-2 flex-row">
                        <LanguageSelector
                          selectedLanguage={selectedLanguage}
                          setSelectedLanguage={setSelectedLanguage}
                          languages={languages}
                        />
                        <IconVolume
                          size={22}
                          onClick={() => handleAudioPlayback(pronunciationText)}
                        />
                      </span>
                      <div className="flex flex-row items-center space-x-2 pr-4 cursor-pointer">
                        <IconCopy size={22} onClick={handleCopyToClipboard} />
                        {copied && (
                          <span className="text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                        <IconStar
                          size={22}
                          onClick={handleFavorite}
                          className={favorite ? "text-yellow-500" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div
                className="fixed top-[280px] right-[160px] cursor-pointer"
                style={{ height: "400px", width: "400px", marginTop: "-100px" }}
              >
                <Player
                  src={characterSources[character] || "/default_character.json"} // Default in case of undefined character
                  autoplay
                  loop
                  style={{ height: "100%", width: "100%" }} // Make sure to fill the fixed container
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
