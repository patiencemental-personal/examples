import TextBox1 from "./1_react_controlled_canvas";
import TextBox2 from "./2_react_uncontrolled_canvas";
import TextBox3 from "./3_react_uncontrolled_clone_elem";
import TextBox4V from "./4_vanilla";
import TextBox5 from "./5_react_useImperativeHandle";
import cx from "./cx";

const TextBoxes = () => {
  return (
    <div className={cx("TextBoxes")}>
      <h2>반응형 텍스트박스</h2>
      <TextBox1 />
      <TextBox2 />
      <TextBox3 />
      <TextBox4V />
      <TextBox5 />
    </div>
  );
};

export default TextBoxes;
