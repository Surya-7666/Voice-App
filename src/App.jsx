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
  const [userInfo] = useState(() => {
    // Persistent random user ID and Name
    const adjectives = ["Swift", "Chill", "Loud", "Zen", "Mighty", "Bright"];
    const animals = ["Tiger", "Eagle", "Wolf", "Panther", "Falcon", "Fox"];
    const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}`;
    const id = "VC" + Math.floor(1000 + Math.random() * 9000);
    return { userID: id, userName: `${name}_${id}` };
  });

  const appID = 111339110;
  const serverSecret = "effd02efd3c90d6eca9dcdbf1bf1e3b4";

  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    null,
    userInfo.userID,
    userInfo.userName
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // simulate init
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
          title: "My Vibe Call ID",
          text: `Hey! Connect with me on Vibe Call. My ID: ${userInfo.userID}`,
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

    const roomID = `${userInfo.userID}-${callee.userID}`; // unique room for caller & callee
    const zp = ZegoUIKitPrebuilt.create(TOKEN);

    // Join the call room
    zp.joinRoom({
      container: document.getElementById("call-container"),
      scenario: callType === 0 ? "voice_call" : "video_call",
      roomID: roomID,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
    });

    const newCall = {
      id: Date.now(),
      name: callee.userName,
      type: callType === 0 ? "Voice" : "Video",
    };
    setRecentCalls((prev) => [newCall, ...prev.slice(0, 2)]);
    setIsCalling(false);
    setShowPopup(false);
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
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2 text-center bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        Vibe Call
      </h1>
      <p className="text-sm sm:text-base mb-6 opacity-70 text-center">
        Connect Instantly — Voice & Video Calls, Anytime, Anywhere
      </p>

      <div
        className={`relative z-10 w-full max-w-md p-8 ${
          darkMode ? "bg-white/10" : "bg-white/60"
        } backdrop-blur-md rounded-3xl shadow-2xl border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col items-center gap-6`}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">Welcome, Caller</h2>
          <p className="text-sm opacity-70">You are connected as</p>
          <div className="mt-2 space-y-1">
            <h3 className="font-semibold">
              <span className="text-sky-500">Name:</span> {userInfo.userName}
            </h3>
            <h3 className="font-semibold flex items-center justify-center gap-2">
              <span className="text-sky-500">UserID:</span> {userInfo.userID}
              <button
                onClick={() => copyToClipboard(userInfo.userID)}
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

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}
          >
            🎤 Voice Call
          </button>

          <button
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}
          >
            🎥 Video Call
          </button>
        </div>

        {recentCalls.length > 0 && (
          <div className="w-full mt-4 border-t pt-3">
            <h4 className="text-sm font-semibold opacity-70 mb-2">Recent Calls</h4>
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

      <div id="call-container" className="w-full max-w-4xl mt-6 h-[400px] rounded-xl overflow-hidden"></div>

      <p className="text-xs opacity-70 mt-6 z-10">
        Made with 💙 by <span className="font-semibold">Surya</span>
      </p>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-sky-600 mb-4">
              Enter Callee Details
            </h2>

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
                onChange={(e) =>
                  setCallee({ ...callee, userID: e.target.value })
                }
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="text"
                placeholder="Enter Callee's Username"
                value={callee.userName}
                onChange={(e) =>
                  setCallee({ ...callee, userName: e.target.value })
                }
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
