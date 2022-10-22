import { CSSProperties, FC, ReactNode, useEffect, useRef } from "react";
import styles from "./HorizontalSlider.module.css";

interface HorizontalSliderProps {
  pages: ReactNode[];
  style?: CSSProperties;
  sectionStyle?: CSSProperties;
  className?: string;
  sectionClass?: string;
  scrollTo: number;
}

const HorizontalSlider: FC<HorizontalSliderProps> = ({
  pages,
  style,
  className,
  sectionClass,
  sectionStyle,
  scrollTo,
}) => {
  const sectionRefs = useRef([] as HTMLElement[]);
  useEffect(() => {
    if (scrollTo > -1 && sectionRefs.current[scrollTo]) {
      sectionRefs.current[scrollTo].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [scrollTo]);

  return (
    <div
      style={{
        ...style,
        ...{ gridTemplateColumns: `repeat(${pages.length}, 100vw)` },
      }}
      className={`${styles.wrapper} ${className}`}
    >
      {pages.map((page, key) => (
        <section
          style={sectionStyle}
          ref={(ref) => {
            if (ref) sectionRefs.current[key] = ref;
          }}
          className={`${styles.section} ${sectionClass}`}
          key={key}
        >
          {page}
        </section>
      ))}
    </div>
  );
};

export default HorizontalSlider;
