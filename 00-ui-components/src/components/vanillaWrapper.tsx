import { useEffect, useRef } from "react";

/**
 * React로 구동되는 컴포넌트 이지만, 이 컴포넌트의 인자로 전달되면 React없이 실제 Vanilla로만 작업하게끔 바꿔주는 함수
 * VanillaWrapper - React 컴포넌트
 * 그러나 VanillaWrapper는 JS 구문을 실행해주는 함수(initiator)를 전달 받은 후 -> 함수(initiator)를 컴포넌트가 렌더링 된 다음에 한번만 그 함수를 실행해주는 목적의 래퍼임
 */
const VanillaWrapper = ({
  title = "",
  subTitle = "",
  initiator,
}: {
  title?: string;
  subTitle?: string;
  initiator: (wrapper: HTMLDivElement) => void;
}) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const isInit = useRef(false);

  /**
   * 1. return 구문이 실행되어 컴포넌트가 렌더링됩니다.
   * 2. 그 이후 useEffect가 실행됩니다.
   * 3. 컴포넌트가 최초 렌더링된 이후 initiator가 wrapper(HTMLDivElement)를 인자로 받아서 실행됩니다.
   * 4. initiator는 외부에서 주입받아야 합니다.
   */
  useEffect(() => {
    if (!isInit.current && !!wrapper.current) {
      initiator(wrapper.current);
      isInit.current = true;
    }
  }, [initiator]);

  return (
    <>
      {title && (
        <h3>
          {title}. Vanilla {subTitle && <sub>{subTitle}</sub>}
        </h3>
      )}
      <div id="vainlla-wrapper-ref" ref={wrapper} />
    </>
  );
};

export default VanillaWrapper;
