import { Editor, type EditorOptions } from "@tiptap/core";
import {
  type Accessor,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";
import { useEditorState } from "./useEditorState";

const isSSR = typeof window === "undefined";
const isDev =
  //@ts-expect-error
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";
const isNext =
  isSSR || Boolean(typeof window !== "undefined" && (window as any).next);

export type UseEditorOptions = Partial<EditorOptions> & {
  /**
   * Whether to render the editor on the first render.
   * If client-side rendering, set this to `true`.
   * If server-side rendering, set this to `false`.
   * @default true
   */
  immediatelyRender?: boolean;
  /**
   * Whether to re-render the editor on each transaction.
   * This is legacy behavior that will be removed in future versions.
   * @default false
   */
  shouldRerenderOnTransaction?: boolean;
};

function compareOptions(a: UseEditorOptions, b: UseEditorOptions) {
  const keys = Object.keys(a) as (keyof UseEditorOptions)[];
  return keys.every((key) => {
    if (
      [
        "onCreate",
        "onBeforeCreate",
        "onDestroy",
        "onUpdate",
        "onTransaction",
        "onFocus",
        "onBlur",
        "onSelectionUpdate",
        "onContentError",
        "onDrop",
        "onPaste",
      ].includes(key)
    ) {
      // we don't want to compare callbacks, they are always different and only registered once
      return true;
    }

    // We often encourage putting extensions inlined in the options object, so we will do a slightly deeper comparison here
    if (key === "extensions" && a.extensions && b.extensions) {
      if (a.extensions.length !== b.extensions.length) {
        return false;
      }
      return a.extensions.every((extension, index) => {
        return extension === b.extensions?.[index];
      });
    }

    if (a[key] !== b[key]) {
      // if any of the options have changed, we should update the editor options
      return false;
    }
    return true;
  });
}

export function useEditor(
  options: UseEditorOptions & { immediatelyRender: false },
  deps?: any[],
): Accessor<Editor | null>;
export function useEditor(
  options?: UseEditorOptions,
  deps?: any[],
): Accessor<Editor>;
export function useEditor(
  options: UseEditorOptions = {},
  deps: any[] = [],
): Accessor<Editor | null> {
  const [editor, setEditor] = createSignal<Editor | null>(null);
  let instanceId = "";
  let isComponentMounted = false;
  let scheduledDestructionTimeout: ReturnType<typeof setTimeout> | undefined;
  let previousDeps: any[] | null = null;

  // We need to keep track of the latest options for callbacks
  let currentOptions = options;

  const createEditorInstance = (opts: UseEditorOptions): Editor => {
    const instance = new Editor({
      ...opts,
      // Always call the most recent version of the callback function by default
      onBeforeCreate: (...args) => currentOptions.onBeforeCreate?.(...args),
      onBlur: (...args) => currentOptions.onBlur?.(...args),
      onCreate: (...args) => currentOptions.onCreate?.(...args),
      onDestroy: (...args) => currentOptions.onDestroy?.(...args),
      onFocus: (...args) => currentOptions.onFocus?.(...args),
      onSelectionUpdate: (...args) =>
        currentOptions.onSelectionUpdate?.(...args),
      onTransaction: (...args) => currentOptions.onTransaction?.(...args),
      onUpdate: (...args) => currentOptions.onUpdate?.(...args),
      onContentError: (...args) => currentOptions.onContentError?.(...args),
      onDrop: (...args) => currentOptions.onDrop?.(...args),
      onPaste: (...args) => currentOptions.onPaste?.(...args),
      onDelete: (...args) => currentOptions.onDelete?.(...args),
    });

    instanceId = Math.random().toString(36).slice(2, 9);
    return instance;
  };

  const refreshEditorInstance = () => {
    const currentInstance = untrack(editor);
    if (currentInstance && !currentInstance.isDestroyed) {
      if (previousDeps !== null) {
        const depsAreEqual =
          previousDeps.length === deps.length &&
          previousDeps.every((dep, i) => dep === deps[i]);

        if (depsAreEqual) {
          return;
        }
      }
      currentInstance.destroy();
    }

    setEditor(createEditorInstance(options));
    previousDeps = [...deps];
  };

  const scheduleDestroy = (instance: Editor | null, id: string) => {
    if (!instance) {
      return;
    }

    scheduledDestructionTimeout = setTimeout(() => {
      if (isComponentMounted && instanceId === id) {
        // If still mounted on the following tick, with the same instanceId, do not destroy the editor
        // just re-apply options as they might have changed
        instance.setOptions(currentOptions);
        return;
      }

      if (!instance.isDestroyed) {
        instance.destroy();
        if (instanceId === id) {
          setEditor(null);
        }
      }
    }, 1);
  };

  // Initial creation logic
  const getInitialEditor = () => {
    if (options.immediatelyRender === undefined) {
      if (isSSR || isNext) {
        if (isDev) {
          throw new Error(
            "Tiptap Error: SSR has been detected, please set `immediatelyRender` explicitly to `false` to avoid hydration mismatches.",
          );
        }
        return null;
      }
      return createEditorInstance(options);
    }

    if (options.immediatelyRender && isSSR && isDev) {
      throw new Error(
        "Tiptap Error: SSR has been detected, and `immediatelyRender` has been set to `true` this is an unsupported configuration that may result in errors, explicitly set `immediatelyRender` to `false` to avoid hydration mismatches.",
      );
    }

    if (options.immediatelyRender) {
      return createEditorInstance(options);
    }

    return null;
  };

  const initial = getInitialEditor();
  if (initial) {
    setEditor(initial);
    previousDeps = [...deps];
  }

  onMount(() => {
    isComponentMounted = true;
    clearTimeout(scheduledDestructionTimeout);

    const instance = untrack(editor);
    if (!instance && !isSSR) {
      refreshEditorInstance();
    } else if (instance && deps.length > 0) {
      // If we already have an instance but deps changed between creation and mount
      refreshEditorInstance();
    }
  });

  onCleanup(() => {
    isComponentMounted = false;
    scheduleDestroy(untrack(editor), instanceId);
  });

  // Re-sync options
  createEffect(() => {
    currentOptions = options;
    const instance = editor();
    if (instance && !instance.isDestroyed && deps.length === 0) {
      if (!compareOptions(options, instance.options)) {
        instance.setOptions({
          ...options,
          editable: options.editable ?? instance.isEditable,
        });
      }
    }
  });

  // Handle deps changes
  createEffect(
    on(
      () => [...deps],
      () => {
        if (isComponentMounted) {
          refreshEditorInstance();
        }
      },
      { defer: true },
    ),
  );

  // The default behavior is to re-render on each transaction
  // This is legacy behavior that will be removed in future versions
  useEditorState({
    editor,
    selector: ({ transactionNumber }) => {
      if (
        options.shouldRerenderOnTransaction === false ||
        options.shouldRerenderOnTransaction === undefined
      ) {
        return null;
      }

      if (options.immediatelyRender && transactionNumber === 0) {
        return 0;
      }
      return transactionNumber + 1;
    },
  });

  return editor;
}
