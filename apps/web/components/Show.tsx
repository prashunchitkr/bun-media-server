import React from "react";

interface IShowProps {
  if: boolean;
  children: React.ReactNode;
}

export function Show({ if: condition, children }: IShowProps) {
  return condition ? <>{children}</> : null;
}
