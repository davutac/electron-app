import electronLogo from "./assets/electron.svg";
import Versions from "./components/versions";

const handleIpc = (): void => {
  window.electron.ipcRenderer.send("ping");
};

const App = (): React.JSX.Element => (
  <>
    <img alt="logo" className="logo" src={electronLogo} />
    <div className="creator">Powered by electron-vite</div>
    <div className="text">
      Build an Electron app with <span className="react">React</span>
      &nbsp;and <span className="ts">TypeScript</span>
    </div>
    <p className="tip">
      Please try pressing <code>F12</code> to open the devTool
    </p>
    <div className="actions">
      <div className="action">
        <a href="https://electron-vite.org/" rel="noreferrer" target="_blank">
          Documentation
        </a>
      </div>
      <div className="action">
        <button type="button" onClick={handleIpc}>
          Send IPC
        </button>
      </div>
    </div>
    <Versions />
  </>
);

export default App;
