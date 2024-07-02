import Accordion1 from "./1_react";
import Accordion2 from "./2_react_hidden_and_show";
import Accordion3 from "./3_react_hidden_and_show_transition";
import Accordion4V from "./4_vanilla";
import Accordion5 from "./5_react_input_radio";
import Accordion6 from "./6_react_search_ctrl_f";
import Accordion7 from "./7_react_multiple_accordion_search";
import Accordion8 from "./8_react_details_summary_exclusive_accordion";
import cx from "./cx";

const Accordions = () => {
  return (
    <div className={cx("Accordions")}>
      <h2>아코디언</h2>
      <Accordion1 />
      <Accordion2 />
      <Accordion3 />
      <Accordion4V />
      <Accordion5 />
      <Accordion6 />
      <Accordion7 />
      <Accordion8 />
    </div>
  );
};

export default Accordions;
