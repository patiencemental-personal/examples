import { useEffect, useRef, useState } from "react";
import cx from "./cx";
import data from "./data";

const AccordionItem = ({
  id,
  title,
  description,
  current,
  toggle,
}: {
  id: string;
  title: string;
  description: string;
  current: boolean;
  toggle: () => void;
}) => {
  const descRef = useRef<HTMLDivElement>(null);

  /**
   * beforematch가 새로 등장한 API이다 보니 React에서 아직 지원을 안해주는 상황
   * 그래서 Ref를 사용해서 이벤트 리스너를 달아줌
   */
  useEffect(() => {
    if (descRef.current) {
      descRef.current.addEventListener("beforematch", toggle);
    }
    return () => {
      if (descRef.current)
        descRef.current.removeEventListener("beforematch", toggle);
    };
  }, [toggle]);

  return (
    <li className={cx("item", "item3", { current })} key={id}>
      <div className={cx("tab")} onClick={toggle}>
        {title}
      </div>
      {/* 
        HIDDEN 이 current가 false일 때 'until-found'가 들어가는 것이 핵심
        hidden이 소문자일 때 문자가 생겨서 HIDDEN을 대문자로 두는 꼼수를 씀
       */}
      <div
        className={cx("description")}
        ref={descRef}
        HIDDEN={current ? undefined : "until-found"}
      >
        {description}
      </div>
    </li>
  );
};

const Accordion6 = () => {
  const [currentId, setCurrentId] = useState<string | null>(data[0].id);
  const toggleItem = (id: string) => () => {
    setCurrentId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <h3>
        #6. React<sub>ctrl+F 검색 가능</sub>
      </h3>
      <ul className={cx("container")}>
        {data.map((d, i) => (
          <AccordionItem
            {...d}
            key={d.id}
            current={currentId === d.id}
            toggle={toggleItem(d.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default Accordion6;

/* 참고: https://hiddenest.dev/accessible-accordion */
