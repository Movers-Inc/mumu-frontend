import classNames from "classnames";
import { FC } from "react";

interface TabsProps {
  labels: string[];
  scroll?: boolean;
  className?: string;
  selectedIndex: number;
  onSelect?: (index: number) => void;
  underline?: boolean;
}

const Tabs: FC<TabsProps> = (props) => {
  const {
    labels,
    scroll = false,
    className,
    selectedIndex,
    onSelect,
    underline = false,
  } = props;

  return (
    <div
      className={classNames(
        "flex w-full select-none flex-row",
        scroll ? "overflow-x-scroll" : "flex-wrap",
        className
      )}
    >
      {labels.map((label, index) => (
        <div
          key={label}
          className={classNames(
            "flex grow items-center justify-center text-[16px] p-3",
            index === selectedIndex
              ? "border-b-[3px] border-b-[#172029] py-[10px] text-[#172029]"
              : underline
              ? "border-b-[3px] border-b-[#DEE3E8] text-[#6A7584]"
              : "text-[#6A7584]"
          )}
          onClick={() => onSelect?.(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
