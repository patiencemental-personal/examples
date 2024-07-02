import { SyntheticEvent, useState } from "react";
import cx from "./cx";
import { measureLines } from "@/service/util";

const TextBox1 = () => {
  const [text, setText] = useState("");
  const [lines, setLines] = useState(3);

  const handleChange = (e: SyntheticEvent) => {
    const elem = e.target as HTMLTextAreaElement;
    const val = elem.value;
    /**
     * 총 몇줄인지 알 수 있는 코드
     * 그러나 한계는 사용자가 엔터를 친 경우에만 구분을 함
     * 만약 사용자가 엔터를 안치고 그냥 계속 한줄로 쭉 작성하면? textarea 영역을 넘어설 때 실제로는 한줄이지만
     * textarea 아래쪽으로 컨텐츠가 차게 될 것임
     */
    // const lines = val.split('\n').length
    const lines = Math.min(Math.max(measureLines(elem, val), 3), 15); // 최소3줄 최대15줄
    setText(val);
    setLines(lines);
  };

  return (
    <>
      <h3>
        #1. React<sub>controlled. canvas</sub>
      </h3>
      <p>Controlled Component: React가 상태를 관리하고 있는 컴포넌트</p>
      <p>보통 Form 요소에 대해 많이 사용</p>
      <p>
        onChange에 대해 React에 있는 이벤트 핸들러를 걸어서 React가 그 상태를
        관리해서 value에 영향을 주게끔 하는 녀석
      </p>
      <div className={cx("container")}>
        <textarea
          className={cx("textarea")}
          onChange={handleChange}
          rows={lines}
          value={text}
        />
      </div>
    </>
  );
};
export default TextBox1;
