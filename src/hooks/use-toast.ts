// Import React library for component hooks
import * as React from "react";

// Import type definitions from the toast UI component
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Maximum number of toasts that can be displayed simultaneously
const TOAST_LIMIT = 1;

// Delay in milliseconds before removing a dismissed toast from memory
const TOAST_REMOVE_DELAY = 1000000;

// Type definition for a single toast notification
// Extends the base ToastProps with additional fields
type ToasterToast = ToastProps & {
  id: string; // Unique identifier for the toast
  title?: React.ReactNode; // Optional title of the toast
  description?: React.ReactNode; // Optional description/message content
  action?: ToastActionElement; // Optional action button displayed in the toast
};

// Action type constants used to dispatch different toast operations
const actionTypes = {
  ADD_TOAST: "ADD_TOAST", // Action to create and display a new toast
  UPDATE_TOAST: "UPDATE_TOAST", // Action to modify an existing toast
  DISMISS_TOAST: "DISMISS_TOAST", // Action to hide/close a toast
  REMOVE_TOAST: "REMOVE_TOAST", // Action to permanently delete a toast from state
} as const;

// Global counter for generating unique toast IDs
let count = 0;

// Function to generate unique ID for each toast
// Increments counter and wraps around to prevent overflow
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Type alias for available action types
type ActionType = typeof actionTypes;

// Union type for all possible dispatch actions
// Each action type has its own shape with specific payload structure
type Action =
  | {
      // Add a new toast to the state
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast; // The complete toast object to add
    }
  | {
      // Update properties of an existing toast
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>; // Partial toast with only properties to update
    }
  | {
      // Dismiss/hide a toast or all toasts
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"]; // Optional ID; if undefined, dismiss all
    }
  | {
      // Permanently remove a toast or all toasts from state
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"]; // Optional ID; if undefined, remove all
    };

// State interface containing all active toasts
interface State {
  toasts: ToasterToast[]; // Array of current toast notifications
}

// Map to track timeout IDs for scheduled toast removals
// Used to prevent duplicate removals and manage cleanup
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Function to schedule removal of a toast after a delay
// Ensures a toast is not removed twice by checking the timeout map
const addToRemoveQueue = (toastId: string) => {
  // Check if a removal timeout already exists for this toast
  if (toastTimeouts.has(toastId)) {
    return; // Skip if already queued for removal
  }

  // Create a timer that will remove the toast after the specified delay
  const timeout = setTimeout(() => {
    // Remove the timeout from tracking map
    toastTimeouts.delete(toastId);
    // Dispatch action to permanently remove the toast from state
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  // Store the timeout ID in the map for tracking
  toastTimeouts.set(toastId, timeout);
};

// Reducer function that manages toast state transitions
// Takes current state and an action, returns new state
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Add new toast to the beginning of the array and limit by TOAST_LIMIT
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      // Update an existing toast by matching ID and merging new properties
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Schedule removal of the dismissed toast(s) after delay
      // Side effect: This schedules the timeout for removal
      if (toastId) {
        // If a specific toast ID is provided, dismiss only that toast
        addToRemoveQueue(toastId);
      } else {
        // If no ID provided, dismiss all toasts by scheduling each for removal
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      // Update state to hide the dismissed toast(s)
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Hide the toast by setting open to false
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      // Permanently remove toast(s) from the state array
      if (action.toastId === undefined) {
        // If no ID provided, clear all toasts
        return {
          ...state,
          toasts: [],
        };
      }
      // Remove specific toast by filtering it out
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Array of listener functions that subscribe to state changes
// When state updates, all listeners are called with the new state
const listeners: Array<(state: State) => void> = [];

// Global memory state that persists across renders
// This allows state to survive component unmounts
let memoryState: State = { toasts: [] };

// Dispatch function to update state and notify all listeners
function dispatch(action: Action) {
  // Update the memory state using the reducer function
  memoryState = reducer(memoryState, action);
  // Notify all subscribed listeners of the state change
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Type for toast parameters (excludes the ID since it's auto-generated)
type Toast = Omit<ToasterToast, "id">;

// Function to create and display a new toast notification
function toast({ ...props }: Toast) {
  // Generate a unique ID for this toast
  const id = genId();

  // Function to update an existing toast's properties
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  // Function to dismiss (hide) the toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Dispatch action to add the new toast to the state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Toast starts as visible
      // Handle when toast open state changes (e.g., when user closes it)
      onOpenChange: (open) => {
        // If toast is being closed, dismiss it
        if (!open) dismiss();
      },
    },
  });

  // Return object containing toast ID and control functions
  return {
    id: id,
    dismiss, // Function to close the toast
    update, // Function to update the toast properties
  };
}

// Custom React hook to access toast functionality and state
function useToast() {
  // Initialize component state with the current memory state
  const [state, setState] = React.useState<State>(memoryState);

  // Effect to subscribe/unsubscribe from global state changes
  React.useEffect(() => {
    // Register this component as a listener for state changes
    listeners.push(setState);
    
    // Cleanup function: unsubscribe when component unmounts
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        // Remove this listener from the array
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  // Return state and control functions to the component
  return {
    ...state, // Spread toasts array from state
    toast, // Function to create a new toast
    // Function to dismiss toasts by ID or all if no ID provided
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Export the hook and standalone toast function for use throughout the app
export { useToast, toast };
