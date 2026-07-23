const ONE_SIGNAL_SDK_SRC = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
const ONE_SIGNAL_PERMISSION_REQUESTED_KEY = "onesignal-permission-requested";

type OneSignalInitOptions = {
  appId: string;
  allowLocalhostAsSecureOrigin?: boolean;
  serviceWorkerPath?: string;
  serviceWorkerUpdaterPath?: string;
  serviceWorkerParam?: {
    scope: string;
  };
};

type OneSignalSDK = {
  init: (options: OneSignalInitOptions) => Promise<void>;
  login?: (externalId: string) => Promise<void>;
  logout?: () => Promise<void>;
  Notifications?: {
    requestPermission: () => Promise<NotificationPermission | void>;
    permission?: boolean;
  };
  User?: {
    PushSubscription?: {
      optedIn?: boolean;
      optIn?: () => Promise<void>;
    };
  };
};

declare global {
  interface Window {
    OneSignal?: OneSignalSDK;
    OneSignalDeferred?: Array<(oneSignal: OneSignalSDK) => void | Promise<void>>;
  }
}

let oneSignalInitPromise: Promise<OneSignalSDK | null> | null = null;

const getOneSignalAppId = (): string | undefined => {
  return process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
};

const getBasePath = (): string => {
  const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

  if (envBasePath) {
    return envBasePath.startsWith("/") ? envBasePath : `/${envBasePath}`;
  }

  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return "/admin";
  }

  return "";
};

export const ensureOneSignalInitialized = async (): Promise<OneSignalSDK | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  const appId = getOneSignalAppId();

  if (!appId) {
    console.warn("NEXT_PUBLIC_ONESIGNAL_APP_ID is missing. Skipping OneSignal initialization.");
    return null;
  }

  if (oneSignalInitPromise) {
    return oneSignalInitPromise;
  }

  oneSignalInitPromise = new Promise<OneSignalSDK | null>((resolve, reject) => {
    const basePath = getBasePath();
    const serviceWorkerBasePath = basePath || "/";
    const initOptions: OneSignalInitOptions = {
      appId,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: `${serviceWorkerBasePath}/OneSignalSDKWorker.js`.replace("//", "/"),
      serviceWorkerUpdaterPath: `${serviceWorkerBasePath}/OneSignalSDKUpdaterWorker.js`.replace(
        "//",
        "/"
      ),
      serviceWorkerParam: {
        scope: serviceWorkerBasePath.endsWith("/")
          ? serviceWorkerBasePath
          : `${serviceWorkerBasePath}/`,
      },
    };

    const runInit = async (oneSignal: OneSignalSDK) => {
      try {
        await oneSignal.init(initOptions);
        resolve(oneSignal);
      } catch (error) {
        if (window.OneSignal) {
          resolve(window.OneSignal);
          return;
        }

        oneSignalInitPromise = null;
        reject(error);
      }
    };

    if (window.OneSignal) {
      void runInit(window.OneSignal);
      return;
    }

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (oneSignal) => {
      await runInit(oneSignal);
    });

    const hasScript = !!document.querySelector(`script[src="${ONE_SIGNAL_SDK_SRC}"]`);

    if (!hasScript) {
      const script = document.createElement("script");
      script.src = ONE_SIGNAL_SDK_SRC;
      script.defer = true;
      script.onerror = () => {
        oneSignalInitPromise = null;
        reject(new Error("Failed to load OneSignal SDK script."));
      };
      document.head.appendChild(script);
    }
  });

  return oneSignalInitPromise;
};

export const syncOneSignalUser = async (externalId: string): Promise<void> => {
  if (!externalId) {
    return;
  }

  const oneSignal = await ensureOneSignalInitialized();

  if (!oneSignal) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  if (oneSignal.User?.PushSubscription?.optedIn !== true) {
    return;
  }

  if (oneSignal.login) {
    await oneSignal.login(externalId);
  }
};

export const requestOneSignalPermissionAndLogin = async (
  externalId: string
): Promise<void> => {
  if (!externalId) {
    return;
  }

  const oneSignal = await ensureOneSignalInitialized();

  if (!oneSignal) {
    return;
  }

  if (typeof window !== "undefined" && Notification.permission === "default") {
    if (oneSignal.Notifications?.requestPermission) {
      localStorage.setItem(ONE_SIGNAL_PERMISSION_REQUESTED_KEY, "1");
      await oneSignal.Notifications.requestPermission();
    }
  }

  if (
    Notification.permission === "granted" &&
    oneSignal.User?.PushSubscription?.optedIn !== true &&
    oneSignal.User?.PushSubscription?.optIn
  ) {
    await oneSignal.User.PushSubscription.optIn();
  }

  if (
    Notification.permission === "granted" &&
    oneSignal.User?.PushSubscription?.optedIn === true &&
    oneSignal.login
  ) {
    await oneSignal.login(externalId);
  }
};

export const logoutOneSignalUser = async (): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.OneSignal?.logout) {
    return;
  }

  try {
    await window.OneSignal.logout();
  } catch (error) {
    console.warn("OneSignal logout failed:", error);
  }
};
