import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type SingletonState<T> = {
  state: T;
  subscribers: Set<(newState: T) => void>;
  setState: Dispatch<SetStateAction<T>>;
};

export const createSingletonState = <T>(initialState: T): SingletonState<T> => {
  const stateObj: SingletonState<T> = {
    state: initialState,
    subscribers: new Set(),
    setState: function (newState: T | ((prevState: T) => T)) {
      const resolvedState = typeof newState === 'function' ? (newState as (prevState: T) => T)(this.state) : newState;

      this.state = resolvedState;
      this.subscribers.forEach((subscriber) => subscriber(this.state));
    },
  };

  stateObj.setState = stateObj.setState.bind(stateObj);

  return stateObj;
};

export const useSingletonState = <T>(singletonState: SingletonState<T>): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(singletonState.state);

  useEffect(() => {
    const subscriber = (newState: T) => setState(newState);
    singletonState.subscribers.add(subscriber);

    return () => {
      singletonState.subscribers.delete(subscriber);
    };
  }, []);

  return [state, singletonState.setState];
};
