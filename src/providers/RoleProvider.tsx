"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Role } from "@/dtos/common";

interface RoleContextProps {
  role?: Role;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider = ({
  role,
  children
}: RoleContextProps & { children: ReactNode }) => {
  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
