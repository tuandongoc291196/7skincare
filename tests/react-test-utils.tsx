import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React, { ReactElement } from "react";

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "queries">) =>
  render(ui, {
    wrapper: ({ children }) => <>{children}</>,
    ...options,
  });

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";
