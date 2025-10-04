import React, { useEffect, useRef } from 'react'
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function App() {
  const zpRef = useRef(null);
  const userID = "user" + Math.floor(Math.random() * 1000);
  const userName = "Voice_" + userID;

  const appID = 111339110;
  const serverSecret = "effd02efd3c90d6eca9dcdbf1bf1e3b4";

  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    null,
    userID,
    userName
  );

  useEffect(() => {
    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    zpRef.current = zp;
    zp.addPlugins({ ZIM });
  }, [TOKEN]);

  function invite(callType) {
    const targetUser = {
      userID: prompt("Enter Callee's userId"),
      userName: prompt("Enter Callee's userName")
    };
    zpRef.current.sendCallInvitation({
      callees: [targetUser],
      callType,
      timeout: 60,
    })
      .then((res) => console.warn(res))
      .catch((err) => console.warn(err));
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center justify-center gap-10 px-4 py-6">
      
      {/* Project Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg animate-pulse text-center">
        CallSphere – Connect Instantly
      </h1>

      {/* Card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center gap-6 text-white">
        
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-20"></div>

        {/* User Info */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Voice & Video Calls
          </h2>
          <p className="text-gray-300 text-sm md:text-base">You are connected as</p>
          <h3 className="text-base md:text-lg font-semibold break-all">
            <span className="text-blue-400">Name: </span>{userName}
          </h3>
          <h3 className="text-base md:text-lg font-semibold break-all">
            <span className="text-blue-400">UserID: </span>{userID}
          </h3>
        </div>

        {/* Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row md:flex-col gap-4 w-full">
          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-black text-base sm:text-lg font-semibold shadow-md hover:scale-105 transform transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}
          >
             Start Voice Call
          </button>

          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white text-base sm:text-lg font-semibold shadow-md hover:scale-105 transform transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}
          >
             Start Video Call
          </button>
        </div>
      </div>

      {/* Footer / Tagline */}
      <p className="text-xs sm:text-sm md:text-base text-gray-300 opacity-80 text-center mt-4">
        Made with ❤️ by Surya
      </p>
    </div>
  )
}

export default App;
