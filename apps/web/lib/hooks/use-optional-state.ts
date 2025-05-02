import { useState, Dispatch, SetStateAction } from 'react';

/**
 * A custom hook that allows you to manage a state that can be either local or controlled by props.
 * 
 * Example usage:
 * ```tsx
 * function MyComponent({
 *   initialName,
 *   name: propName,
 *   setName: setPropName
 * }: {
 *   initialName: string;
 *   name?: string;
 *   setName?: React.Dispatch<React.SetStateAction<string>>;
 * }) {
 *   const [name, setName] = useOptionalState({
 *     initialValue: initialName,
 *     value: propName,
 *     setValue: setPropName,
 *   });
 * 
 *   return (
 *     <div>
 *       <p>Name: { name } </p>
 *         <button onClick = {() => setName('New Name')}> Change Name </button>
 *     </div>
 *   );
 * }
 * ```
 *   
 * @param props - An object containing the initial value, controlled value, and setter function.
 * @returns A tuple containing the current value and the setter function.
 */

interface UseOptionalStateProps<T> {
  initialValue: T;
  value?: T | null;
  setValue?: Dispatch<SetStateAction<T | null>>;
}

export function useOptionalState<T>(
  props: UseOptionalStateProps<T>
): [T | null, Dispatch<SetStateAction<T | null>>] {
  const { initialValue, value: propValue, setValue: setPropValue } = props;

  const [stateValue, setStateValue] = useState<T | null>(initialValue);

  const value = propValue !== undefined ? propValue : stateValue;
  const setValue = setPropValue !== undefined ? setPropValue : setStateValue;

  return [value, setValue];
}
