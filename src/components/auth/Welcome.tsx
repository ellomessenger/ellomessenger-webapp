import React, { FC } from 'react';
import Button from '../ui/Button';

interface WelcomeProps {
  setInit: (val: boolean) => void;
}

const Welcome: FC<WelcomeProps> = ({ setInit }) => {
  const handleSkip = () => {
    setInit(false);
  };
  return (
    <div>
      <h1>Welcome</h1>
      <Button onClick={handleSkip}>Skip</Button>
    </div>
  );
};

export default Welcome;
