import React from "react";

interface IForProps<T> {
  each: T[];
  children: (item: T, index: number) => React.ReactNode;
}

export function For<T>({ each: items, children }: IForProps<T>) {
  return <>{items.map(children)}</>;
}
