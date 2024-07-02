import { useState } from "react";
import cx from "./cx";
import data from "./data";

const TabItem = ({
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
      <div className={cx("description")}>{description}</div>
    </li>
  );
};

const TabMenu3 = () => {
  const [currentId, setCurrentId] = useState<string>(data[0].id);

  const toggleItem = (id: string) => () => {
    setCurrentId(id);
  };
  return (
    <>
      <h3>
        #3. React<sub>한 li 안에 title/desc 모두 있게 처리</sub>
      </h3>
      <p>이런식으로 할 경우 Screen Reader로 읽게 하기 수월하다</p>
      <a
        href="https://www.inflearn.com/course/lecture?courseSlug=react-vanillajs-ui%EC%9A%94%EC%86%8C%EB%A7%8C%EB%93%A4%EA%B8%B0-part1&unitId=212065&tab=curriculum"
        target="_blank"
      >
        영상 4:30
      </a>
      <ul className={cx("container", "tabMenu3")}>
        {data.map((d) => (
          <TabItem
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

export default TabMenu3;
