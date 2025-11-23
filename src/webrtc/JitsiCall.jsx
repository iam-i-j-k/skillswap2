// In src/webrtc/JitsiCall.jsx
import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiCall = ({ roomName, displayName, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black">
    <JitsiMeeting
        domain="meet.jit.si" // ✅ No moderator waiting screen
        roomName={roomName}
        userInfo={{ displayName }}
        configOverwrite={{
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
        }}
        interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: [
            "microphone", "camera", "desktop", "chat", "hangup", "fullscreen"
            ],
        }}
        onApiReady={(api) => {
            api.addListener("readyToClose", onClose);
        }}
        getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100vh";
        }}
    />
  </div>
);

export default JitsiCall;
