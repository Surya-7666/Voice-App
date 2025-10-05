import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const zpRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [callType, setCallType] = useState(null);
  const [callee, setCallee] = useState({ userID: "", userName: "" });
  const [isCalling, setIsCalling] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recentCalls, setRecentCalls] = useState([]);

  // ✅ Generate persistent userID & username per session
  const [userID] = useState(() => {
    return localStorage.getItem("vibe_userID") || "VIBE" + Math.floor(1000 + Math.random() * 9000);
  });

  const [userName] = useState(() => {
    return localStorage.getItem("vibe_userName") || `Caller_${userID}`;
  });

  useEffect(() => {
    localStorage.setItem("vibe_userID", userID);
    localStorage.setItem("vibe_userName", userName);
  }, [userID, userName]);

  const appID = 111339110; // replace with your appID
  const serverSecret = "effd02efd3c90d6eca9dcdbf1bf1e3b4"; // replace with your serverSecret

  // 💡 Generate Zego token
  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    null,
    userID,
    userName
  );

  const toggleTheme = () => setDarkMode(!darkMode);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  const shareID = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Vibe Call ID",
          text: `Connect with me on Vibe Call. My ID: ${userID}`,
        })
        .catch(() => toast.error("Share cancelled"));
    } else {
      toast("Sharing not supported on this device");
    }
  };

  const invite = (type) => {
    setCallType(type);
    setShowPopup(true);
  };

  // ✅ Handle call with proper room join
  const handleCall = () => {
    if (!callee.userID || !callee.userName) {
      toast.error("Please fill both fields!");
      return;
    }

    const roomID = `room_${Date.now()}`;
    setIsCalling(true);

    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    zpRef.current = zp;

    // Join room
    zp.joinRoom({
      container: document.getElementById("callContainer"),
      scenario: ZegoUIKitPrebuilt.OneOnOneCall,
      sharedLinks: [
        {
          webURL: window.location.href,
          text: `Join my Vibe Call room!`,
        },
      ],
      onLeaveRoom: () => {
        setIsCalling(false);
        toast.success("Call ended");
      },
    });

    const newCall = {
      id: Date.now(),
      name: callee.userName,
      type: callType === 0 ? "Voice" : "Video",
    };
    setRecentCalls((prev) => [newCall, ...prev.slice(0, 2)]);
    setShowPopup(false);
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-[#f7faff] via-[#e6f0ff] to-[#f4f4ff] text-gray-800"}`}>
      <Toaster position="bottom-center" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Project Title */}
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
        Vibe Call
      </h1>
      <p className="text-sm mb-6 opacity-70 text-center">
        Connect Instantly — Voice & Video Calls, Anytime, Anywhere
      </p>

      {/* User Info Card */}
      <div className="w-full max-w-md p-8 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Welcome, Caller</h2>
          <p className="text-sm opacity-70">You are connected as</p>
          <div className="mt-2 space-y-1">
            <h3 className="font-semibold">
              <span className="text-sky-500">Name:</span> {userName}
            </h3>
            <h3 className="font-semibold flex items-center justify-center gap-2">
              <span className="text-sky-500">UserID:</span> {userID}
              <button
                onClick={() => copyToClipboard(userID)}
                className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-2 py-1 rounded-lg text-xs font-semibold"
              >
                Copy
              </button>
            </h3>
            <button
              onClick={shareID}
              className="text-sm text-sky-600 underline hover:text-sky-800"
            >
              Share My ID
            </button>
          </div>
        </div>

        {/* Call Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 text-white font-semibold shadow hover:scale-105 transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}
          >
            Voice Call
          </button>
          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}
          >
            Video Call
          </button>
        </div>

        {/* Recent Calls */}
        {recentCalls.length > 0 && (
          <div className="w-full mt-4 border-t pt-3">
            <h4 className="text-sm font-semibold opacity-70 mb-2">Recent Calls</h4>
            <ul className="text-sm space-y-1">
              {recentCalls.map((call) => (
                <li key={call.id} className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg">
                  <span>{call.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${call.type === "Voice" ? "bg-sky-500/30 text-sky-300" : "bg-purple-500/30 text-purple-300"}`}>
                    {call.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Call Container */}
      {isCalling && (
        <div id="callContainer" className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center" />
      )}

      {/* Call Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-sky-600 mb-4">Enter Callee Details</h2>

            {isCalling && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 rounded-2xl">
                <div className="animate-ping w-12 h-12 bg-sky-400 rounded-full mb-4"></div>
                <p className="text-sky-700 font-semibold">Connecting...</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Callee's User ID"
                value={callee.userID}
                onChange={(e) => setCallee({ ...callee, userID: e.target.value })}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="text"
                placeholder="Enter Callee's Username"
                value={callee.userName}
                onChange={(e) => setCallee({ ...callee, userName: e.target.value })}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCall}
                  className="flex-1 bg-gradient-to-r from-sky-400 to-sky-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
                >
                  Call Now
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
