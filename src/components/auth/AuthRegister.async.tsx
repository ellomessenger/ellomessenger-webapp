import type { FC } from "react";
import React, { memo } from "react";
import { Bundles } from "../../util/moduleLoader";

import useModuleLoader from "../../hooks/useModuleLoader";
import Loading from "../ui/Loading";

const AuthRegisterAsync: FC = () => {
  const AuthRegister = useModuleLoader(Bundles.Auth, "AuthRegister");

  return AuthRegister ? <AuthRegister /> : <Loading />;
};

export default memo(AuthRegisterAsync);
