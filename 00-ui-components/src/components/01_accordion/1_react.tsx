import { useState } from "react";
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
  return (
    <li className={cx("item", { current })} key={id}>
      <div className={cx("tab")} onClick={toggle}>
        {title}
      </div>
      {/* 
        current가 있을 때만 DOM을 렌더링
        SEO 관점에서 적합하진 않음.. 왜? 렌더링이 안되어 있기 때문에
      */}
      {current ? <div className={cx("description")}>{description}</div> : null}
    </li>
  );
};

const Accordion1 = () => {
  const [currentId, setCurrentId] = useState<string | null>(data[0].id);

  const toggleItem = (id: string) => () => {
    setCurrentId((prev) => (prev === id ? null : id));
  };
  return (
    <>
      <h3>
        #1. React<sub>현재 desc만 html로 그리기</sub>
      </h3>
      <p>스타일 건들지 않고 가장 React 스럽게 구현한 아코디언</p>
      <ul className={cx("container")}>
        {data.map((d) => (
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

export default Accordion1;
