import Tooltip1 from "./1_react_multi_open";
import Tooltip2 from "./2_react_single_open";
import Tooltip3 from "./3_react_html_details_tag";
import Tooltip4 from "./4_react_style_in_view";
import Tooltip5V from "./5_vanilla";
import cx from "./cx";

const Tooltips = () => {
  return (
    <div className={cx("Tooltips")} style={{ marginBottom: 500 }}>
      <h2>툴팁</h2>
      <Tooltip1 />
      <Tooltip2 />
      <Tooltip3 />
      <Tooltip4 />
      <Tooltip5V />
    </div>
  );
};

export default Tooltips;
