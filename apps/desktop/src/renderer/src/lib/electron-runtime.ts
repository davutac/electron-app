interface RuntimeWindow {
  api?: Window["api"];
  electron?: Window["electron"];
}

const getRuntimeWindow = (): RuntimeWindow => window as unknown as RuntimeWindow;

export const hasElectronVersions = (): boolean =>
  getRuntimeWindow().electron?.process.versions !== undefined;

export const hasToastApi = (): boolean => getRuntimeWindow().api?.toasts !== undefined;

export const hasUpdateApi = (): boolean => getRuntimeWindow().api?.updates !== undefined;

export const isWebEnvironment = (): boolean => getRuntimeWindow().electron === undefined;
