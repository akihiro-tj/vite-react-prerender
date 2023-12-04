import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      You clicked me {count} times
    </button>
  );
};

export default Counter;
