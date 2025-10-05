import React, { useEffect, useRef, useState } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const zpRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [callType, setCallType] = useState(null);
  const [callee, setCallee] = useState({ userID: "", userName: "" });
  const [isCalling, setIsCalling] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentCalls, setRecentCalls] = useState([]);

  // Generate stylish username and ID
  const adjectives = ["Swift", "Chill", "Loud", "Zen", "Mighty", "Bright"];
  const animals = ["Tiger", "Eagle", "Wolf", "Panther", "Falcon", "Fox"];
  const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}`;
  const userID = "VC" + Math.floor(1000 + Math.random() * 9000);
  const userName = `${randomName}_${userID}`;

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
    const timer = setTimeout(() => setLoading(false), 1500);
    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    zpRef.current = zp;
    zp.addPlugins({ ZIM });
    return () => clearTimeout(timer);
  }, [TOKEN]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  const shareID = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Vibe Call ID",
          text: `Hey! Connect with me on Vibe Call. My ID: ${userID}`,
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

  const handleCall = () => {
    if (!callee.userID || !callee.userName) {
      toast.error("Please fill both fields!");
      return;
    }

    setIsCalling(true);
    zpRef.current
      .sendCallInvitation({
        callees: [callee],
        callType,
        timeout: 60,
      })
      .then(() => {
        toast.success("Invitation Sent!");
        const newCall = {
          id: Date.now(),
          name: callee.userName,
          type: callType === 0 ? "Voice" : "Video",
        };
        setRecentCalls((prev) => [newCall, ...prev.slice(0, 2)]);
        setIsCalling(false);
        setShowPopup(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send invitation");
        setIsCalling(false);
      });
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 text-gray-700">
        <div className="animate-spin h-12 w-12 border-4 border-sky-400 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-semibold">Loading Vibe Call...</p>
      </div>
    );

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden transition-all duration-700 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-[#f7faff] via-[#e6f0ff] to-[#f4f4ff] text-gray-800"
      }`}
    >
      <Toaster position="bottom-center" />

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${
              darkMode ? "bg-indigo-400" : "bg-sky-300"
            } rounded-full opacity-20`}
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Project Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2 text-center animate-fadeIn bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        Vibe Call
      </h1>
      <p className="text-sm sm:text-base mb-6 opacity-70 text-center">
        Connect Instantly — Voice & Video Calls, Anytime, Anywhere
      </p>

      {/* Main Card */}
      <div
        className={`relative z-10 w-full max-w-md p-8 ${
          darkMode ? "bg-white/10" : "bg-white/60"
        } backdrop-blur-md rounded-3xl shadow-2xl border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col items-center gap-6`}
      >
        {/* User Info */}
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
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}
          >
             Voice Call
          </button>
          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}
          >
             Video Call
          </button>
        </div>

        {/* Recent Calls */}
        {recentCalls.length > 0 && (
          <div className="w-full mt-4 border-t pt-3">
            <h4 className="text-sm font-semibold opacity-70 mb-2">
              Recent Calls
            </h4>
            <ul className="text-sm space-y-1">
              {recentCalls.map((call) => (
                <li
                  key={call.id}
                  className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg"
                >
                  <span>{call.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      call.type === "Voice"
                        ? "bg-sky-500/30 text-sky-300"
                        : "bg-purple-500/30 text-purple-300"
                    }`}
                  >
                    {call.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs opacity-70 mt-6 z-10">
        Made with 💙 by <span className="font-semibold">Surya</span>
      </p>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-sky-600 mb-4">
              Enter Callee Details
            </h2>

            {isCalling && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/90 dark:bg-gray-800 rounded-2xl">
                <div className="animate-ping w-12 h-12 bg-sky-400 rounded-full mb-4"></div>
                <p className="text-sky-700 font-semibold">Connecting...</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Callee's User ID"
                value={callee.userID}
                onChange={(e) =>
                  setCallee({ ...callee, userID: e.target.value })
                }
                className={`p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  darkMode
                    ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                    : "bg-white text-gray-800 placeholder-gray-500 border-gray-300"
                }`}
              />
              <input
                type="text"
                placeholder="Enter Callee's Username"
                value={callee.userName}
                onChange={(e) =>
                  setCallee({ ...callee, userName: e.target.value })
                }
                className={`p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  darkMode
                    ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                    : "bg-white text-gray-800 placeholder-gray-500 border-gray-300"
                }`}
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
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
