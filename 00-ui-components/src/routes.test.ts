import Test1 from "./components/test1"
import Test2_React from "./components/test2/react"
import Test2_Vanilla from "./components/test2/vanilla"

export const routePaths = [
  '/',
  '/test1',
  '/test2',
  '/test2/vanilla',
  '/test2/react',
] as const
export type ROUTE_PATH = (typeof routePaths)[number]

type BaseRoute = {
  key: ROUTE_PATH
  link: ROUTE_PATH
  name: string
}
export type ParentRoute = BaseRoute & {
  children: ROUTE_PATH[]
}
export type ChildRoute = BaseRoute & {
  children: ((props: unknown) => JSX.Element) | null
}
export type ROUTE = ParentRoute | ChildRoute

export const routes: Record<ROUTE_PATH, ROUTE> = {
  '/': {
    key: '/',
    link: '/',
    name: 'root',
    children: [
      '/test1',
      '/test2',
    ],
  },
  '/test1': {
    key: '/test1',
    link: '/test1',
    name: '테스트1',
    children: Test1 // null이면 클릭 불가
  },
  '/test2': {
    key: '/test2',
    link: '/test2/vanilla', // Parent는 첫 번째 요소가 켜지도록 구현
    name: '테스트2',
    children: [
      '/test2/vanilla',
      '/test2/react',
    ]
  },
  '/test2/vanilla': {
    key: '/test2/vanilla',
    link: '/test2/vanilla',
    name: '테스트2 Vanilla',
    children: Test2_Vanilla // null이면 클릭 불가
  },
  '/test2/react': {
    key: '/test2/react',
    link: '/test2/react',
    name: '테스트2 React',
    children: Test2_React // null이면 클릭 불가
  },
}

/**
 * 인자로 받은 route가 children을 가진 Parent Route인지 확인하는 함수
 */
export const isParentRoute = (route: ROUTE): route is ParentRoute => Array.isArray(route.children)

export const gnbRootList = (routes['/'] as ParentRoute).children.map(r => routes[r])
