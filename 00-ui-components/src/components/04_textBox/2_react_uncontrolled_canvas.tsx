import { SyntheticEvent } from "react";
import cx from "./cx";
import { measureLines } from "@/service/util";

const TextBox2 = () => {
  const handleChange = (e: SyntheticEvent) => {
    const elem = e.target as HTMLTextAreaElement;
    const val = elem.value;
    const lines = Math.min(Math.max(measureLines(elem, val), 3), 15); // 최소3줄 최대15줄
    elem.rows = lines;
  };

  return (
    <>
      <h3>
        #2. React<sub>uncontrolled. canvas</sub>
      </h3>
      <p>폼 요소에 해당하는 textarea에 대해 개발자가 처리를 하게끔함</p>
      <p>아래 textarea에 보면 value를 property로 넘기고 있지 않음</p>
      <div className={cx("container")}>
        <textarea className={cx("textarea")} rows={3} onInput={handleChange} />
      </div>
    </>
  );
};
export default TextBox2;
