import {
  createContext,
  ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";

type Rect = Pick<DOMRect, "left" | "top" | "width" | "height"> & {
  scrollHeight: number;
};
const DefaultRect: Rect = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  scrollHeight: 0,
};
const rectKeys: (keyof Rect)[] = [
  "scrollHeight",
  "left",
  "top",
  "width",
  "height",
];
const isSameRect = (prev: Rect, next: Rect) => {
  return rectKeys.every((k) => prev?.[k] === next?.[k]);
};

/**
 * document.scrollingElement에 대해서 화면 전체에 대해 BoundingRect 값을 읽어다가 그 값을 반환하는 작업을 하려는 역할
 *
 * 함수를 반환해주는 이유
 * - getViewportRect에서 사용하는 함수를 다시 재사용하기 위함
 * - 근데 DefaultRect를 클로저를 이용해서 사용하기 위함
 *   - DefaultRect를 클로저로 사용하는 이유는
 *      - '이게 useSyncExternalStore가 서버 사이드에서 어떻게 동작할 건지에 대한 것도 준비가 필요해서 그렇다는데 잘 모르겠다'
 *      - 영상 설명
 *        - getViewportRect라는 거를 실행할 때 마다 기존 거랑 같으면 기존 스토어드가 계속 반환됨 => useSyncExternalStore가 계속 실행됨.
 *        - 왜? getViewportRect 함수가 객체 형태로 되어 있으면 매번 새로 만들다 보니까 똑같다는 거를 인지를 못해서 계속 실행되는 것임
 *        - 즉 아래와 같이 클로저를 활용한 이유는 기존 (defaultRect)값을 계속 유지하게끔 해주는 장치가 필요해서 였음!
 *
 * 리턴되는 함수는 useSyncExternalStore의 getSnapshot으로 사용됨
 */
const getViewportRect = () => {
  let stored: Rect = DefaultRect;
  return () => {
    const elem = typeof document !== "undefined" && document.scrollingElement;

    /**
     * scrollingElement가 존재하지 않으면 DefaultRect 리턴
     */
    if (!elem) return stored;

    const { left, top, width, height } = elem.getBoundingClientRect();
    const newRect = {
      left,
      top,
      width,
      height,
      scrollHeight: elem.scrollHeight,
    };

    /**
     * newRect가 존재하고 DefaultRect와 다르다면 newRect 리턴
     */
    if (newRect && !isSameRect(stored, newRect)) stored = newRect;

    /**
     * newRect가 존재하고 DefaultRect와 같다면 defaultRect 리턴
     */
    return stored;
  };
};

const subscribe = (callback: () => void) => {
  /**
   * ResizeObserver를 통해서 창크기 resize에 대한 거를 처리
   */
  const resizeObserver = new ResizeObserver(callback);
  /**
   * @개선_필요
   * scroll에 대한 거는 나중에 스로틀을 걸어서 이벤트가 발생할 때 마다 얘를 호출하지 않도록
   */
  window.addEventListener("scroll", callback);
  resizeObserver.observe(document.body);
  return () => {
    window.removeEventListener("scroll", callback);
    resizeObserver.disconnect();
  };
};

const ViewportContext = createContext<Rect>(DefaultRect);

const ViewportContextProvider = ({ children }: { children: ReactNode }) => {
  /**
   * useSyncExternalStore를 통해서 스크롤 위치를 가져오는 것을 처리
   */
  const viewportRect = useSyncExternalStore(subscribe, getViewportRect());

  return (
    <ViewportContext.Provider value={viewportRect}>
      {children}
    </ViewportContext.Provider>
  );
};
export default ViewportContextProvider;

export const useViewportRect = () => useContext(ViewportContext);
