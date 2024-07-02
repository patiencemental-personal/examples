import data from "./data";
import cx from "./cx";
import { useEffect, useRef } from "react";

const AccordionItem = ({
  title,
  description,
  open,
}: {
  title: string;
  description: string;
  open: boolean;
}) => {
  const descRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const open = () => descRef.current?.open;

    if (descRef.current) {
      descRef.current.addEventListener("beforematch", open);
    }
    return () => {
      if (descRef.current)
        descRef.current.removeEventListener("beforematch", open);
    };
  }, [open]);

  return (
    // react에서 name을 인식을 못하고 있음
    <details name="test" className={cx("item7")} ref={descRef}>
      <summary>{title}</summary>
      <div className={cx("description")}>{description}</div>
    </details>
  );
};

const Accordion8 = () => {
  return (
    <>
      <h3>
        #8. React
        <sub>
          여러 개가 펼쳐지는 아코디언 + 검색가능 (details태그) - by
          강민혜(@himyne)
        </sub>
      </h3>
      <ul className={cx("container")}>
        {data.map((d, i) => (
          <AccordionItem {...d} key={d.id} open={i === 0} />
        ))}
      </ul>
    </>
  );
};

export default Accordion8;
