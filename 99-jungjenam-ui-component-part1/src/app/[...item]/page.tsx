"use client";

import { ROUTE_PATH, isParentRoute, routePaths, routes } from "@/routes";

const ItemPage = ({ params: { item } }: { params: { item: string[] } }) => {
  const path = ["", ...item].join("/") as ROUTE_PATH;
  const route = routes[path];

  console.log(`path: ${path}`);
  console.log(`route: ${JSON.stringify(route, null, 2)}`);

  if (!routePaths.includes(path) || isParentRoute(route) || !route.children) {
    console.log("return null");
    return null;
  }

  const Component = route.children;
  console.log(`route.children: ${route.children}`);
  return <Component />;
};

export default ItemPage;
