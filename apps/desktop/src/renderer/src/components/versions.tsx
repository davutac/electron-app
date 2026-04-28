import { useState } from "react";

const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="flex items-center gap-5 text-xs opacity-45 p-2 list-disc">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  );
};

export default Versions;
