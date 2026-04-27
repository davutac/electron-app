import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  history: createHashHistory(),
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = (): React.JSX.Element => <RouterProvider router={router} />;

export default App;
