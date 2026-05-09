import { createEffect, onCleanup } from "solid-js";

export function useMenuElementProps(element: HTMLElement, props: any) {
  createEffect(() => {
    // Basic attribute syncing
    // For a real production package, this should be more robust (like the React version)
    // but for now let's do the essentials
    const { class: className, style, ...rest } = props;

    if (className) {
      element.className = className;
    }

    if (typeof style === "object") {
      Object.assign(element.style, style);
    }

    for (const [key, value] of Object.entries(rest)) {
      if (key.startsWith("on")) {
        const eventName = key.toLowerCase().substring(2);
        const listener = value as EventListener;
        element.addEventListener(eventName, listener);
        onCleanup(() => element.removeEventListener(eventName, listener));
      } else if (value !== undefined) {
        element.setAttribute(key, String(value));
      } else {
        element.removeAttribute(key);
      }
    }
  });
}
