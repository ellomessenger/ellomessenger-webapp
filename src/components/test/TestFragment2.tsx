import React, { useState } from 'react';

export function App() {
  const [trigger, setTrigger] = useState(true);

  return (
    <div
      className='App'
      onClick={() => {
        setTrigger((current) => !current);
      }}
    >
      <h2>Click to update</h2>
      {true && (
        <>
          {trigger && <span>fragment</span>}
          {trigger && <span>content</span>}
        </>
      )}
      <div>This should always go last.</div>
    </div>
  );
}

export default App;
