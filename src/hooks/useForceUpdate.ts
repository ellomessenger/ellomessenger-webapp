import { useCallback, useState } from "react";

const useForceUpdate = () => {
  const [trigger, setTrigger] = useState<boolean>(false);

  return useCallback(() => {
    setTrigger((trigger) => !trigger);
  }, []);
};

export default useForceUpdate;
