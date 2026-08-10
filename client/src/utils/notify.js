import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { toast as webToast } from "react-toastify";

const isNative = Capacitor.isNativePlatform();

let lastMessage = "";
let lastTime = 0;
const COOLDOWN_MS = 1200;

const shouldShow = (message) => {
  const now = Date.now();
  if (message === lastMessage && now - lastTime < COOLDOWN_MS) {
    return false;
  }
  lastMessage = message;
  lastTime = now;
  return true;
};

const showNative = async (text, duration = "short") => {
  try {
    await Toast.show({ text, duration, position: "bottom" });
  } catch (err) {
    webToast(text);
  }
};

export const toast = {
  success: (message) => {
    if (!shouldShow(message)) return;
    isNative ? showNative(message) : webToast.success(message);
  },
  error: (message) => {
    if (!shouldShow(message)) return;
    isNative ? showNative(message, "long") : webToast.error(message);
  },
  warning: (message) => {
    if (!shouldShow(message)) return;
    isNative ? showNative(message) : webToast.warning(message);
  },
  warn: (message) => {
    if (!shouldShow(message)) return;
    isNative ? showNative(message) : webToast.warn(message);
  },
  info: (message) => {
    if (!shouldShow(message)) return;
    isNative ? showNative(message) : webToast.info(message);
  },
};
