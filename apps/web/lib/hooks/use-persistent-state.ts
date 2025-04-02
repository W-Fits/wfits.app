import { useState, useEffect, Dispatch, SetStateAction } from 'react';


export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [hasMounted, setHasMounted] = useState(false); // Track if component mounted


  const [state, setState] = useState<T>(defaultValue); // Initialize state with default


  useEffect(() => {
    setHasMounted(true); // Set hasMounted to true when component mounts
  }, []);


  useEffect(() => {
    if (hasMounted) {
      // Only access localStorage after component has mounted
      try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          setState(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error('Error getting data from localStorage:', error);
      }
    }
  }, [hasMounted, key]);


  useEffect(() => {
    if (hasMounted) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error('Error setting data to localStorage:', error);
      }
    }
  }, [key, state, hasMounted]);


  const clear = () => {
    try {
      localStorage.removeItem(key);
      setState(defaultValue);
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
    }
  };


  return [state, setState, clear];
}