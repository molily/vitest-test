import { h } from 'preact';
import { useState } from 'preact/hooks';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{count}</h1>
      <p>
        <button onClick={() => setCount(count + 1)} aria-label="Increment">
          +
        </button>
      </p>
    </>
  );
};
