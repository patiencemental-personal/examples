import TabMenu1 from "./1_react";
import TabMenu2 from "./2_react_css_hidden_and_show";
import TabMenu3 from "./3_react_li_title_desc";
import TabMenu4V from "./4_vanilla";
import TabMenu5 from "./5_react_input_radio";
import TabMenu6 from "./6_react_searchable";
import cx from "./cx";

const TabMenus = () => {
  return (
    <div className={cx("TabMenus")}>
      <h2>탭메뉴</h2>
      <TabMenu1 />
      <TabMenu2 />
      <TabMenu3 />
      <TabMenu4V />
      <TabMenu5 />
      <TabMenu6 />
    </div>
  );
};

export default TabMenus;
