import {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./TransWrap.module.css";

// Interfaces
export interface MousePosition {
  x: number;
  y: number;
}

export interface Position {
  width: string;
  height: string;
  rotation: string;
  top: string;
  left: string;
}

export interface TransWrapProps {
  position?: Position;
  resizeHandlerStyles?: CSSProperties[];
  spinHandlerStyle?: CSSProperties;
  wrapperStyles?: CSSProperties;
  className?: string;
  draggable?: boolean;
  spinnable?: boolean;
  resizable?: boolean;
}

// Custom Hooks and Utilities
const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const updateMousePosition = (ev: MouseEvent) => {
    setMousePosition({ x: ev.clientX, y: ev.clientY });
  };
  const updateTouchPosition = (ev: TouchEvent) => {
    setMousePosition({ x: ev.touches[0].clientX, y: ev.touches[0].clientY });
  };

  useEffect(() => {
    if (isTouchDevice()) {
      window.addEventListener("touchmove", updateTouchPosition);
    } else {
      window.addEventListener("mousemove", updateMousePosition);
    }

    return () => {
      if (isTouchDevice()) {
        window.removeEventListener("touchmove", updateTouchPosition);
      } else {
        window.removeEventListener("mousemove", updateMousePosition);
      }
    };
  }, []);

  return mousePosition;
};

const getResizingId = (st: CSSProperties) => {
  if (st.top) {
    if (st.left) return 1;
    if (st.right) return 2;
  }

  if (st.bottom) {
    if (st.right) return 3;
    if (st.left) return 4;
  }

  return -1;
};

// Defaults
const defaultPosition = {
  width: "10rem",
  height: "6rem",
  rotation: "0deg",
  top: "25%",
  left: "25%",
};

const resizerHandleSize = 0.8; // in rem

const defaultResizeHandlerStylesCommon: CSSProperties = {
  position: "absolute",
  border: "2px solid black",
  background: "rgba(0, 0, 0, 0.4)",
  borderRadius: "50%",
  width: `${resizerHandleSize}rem`,
  height: `${resizerHandleSize}rem`,
};

const defaultResizeHandlerStyles = [
  {
    ...defaultResizeHandlerStylesCommon,
    top: `-${resizerHandleSize / 2}rem`,
    left: `-${resizerHandleSize / 2}rem`,
  },
  {
    ...defaultResizeHandlerStylesCommon,
    bottom: `-${resizerHandleSize / 2}rem`,
    left: `-${resizerHandleSize / 2}rem`,
  },
  {
    ...defaultResizeHandlerStylesCommon,
    top: `-${resizerHandleSize / 2}rem`,
    right: `-${resizerHandleSize / 2}rem`,
  },
  {
    ...defaultResizeHandlerStylesCommon,
    bottom: `-${resizerHandleSize / 2}rem`,
    right: `-${resizerHandleSize / 2}rem`,
  },
];

const defaultSpinHandlerStyle: CSSProperties = {
  ...defaultResizeHandlerStylesCommon,
  position: "absolute",
  top: `-${resizerHandleSize + 0.4}rem`,
  left: `calc(50% - ${resizerHandleSize / 2}rem)`,
};

// The Component
const TransWrap: FunctionComponent<TransWrapProps> = ({
  children,
  position = defaultPosition,
  resizeHandlerStyles = defaultResizeHandlerStyles,
  spinHandlerStyle = defaultSpinHandlerStyle,
  wrapperStyles = {},
  className = "",
  draggable = true,
  spinnable = true,
  resizable = true,
}) => {
  const basePosition = position;
  const Wrapper = useRef<HTMLDivElement>(null);
  // Offsets
  const [xPosOffset, setxPosOffset] = useState(0);
  const [yPosOffset, setyPosOffset] = useState(0);
  const [xSizeOffset, setxSizeOffset] = useState(0);
  const [ySizeOffset, setySizeOffset] = useState(0);
  const [angularOffset, setangularOffset] = useState(0);
  // Previous Value of offsets
  const [prevxPosOffset, setprevxPosOffset] = useState(0);
  const [prevyPosOffset, setprevyPosOffset] = useState(0);
  const [prevxSizeOffset, setprevxSizeOffset] = useState(0);
  const [prevySizeOffset, setprevySizeOffset] = useState(0);
  const [prevangularOffset, setprevangularOffset] = useState(0);
  // Features Enabled
  const [resizing, setresizing] = useState(0);
  const [dragging, setdragging] = useState(false);
  const [rotating, setrotating] = useState(false);
  const [initMousePosition, setinitMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const { x, y } = useMousePosition();

  const collectPreviousValues = () => {
    setprevxPosOffset(xPosOffset);
    setprevyPosOffset(yPosOffset);
    setprevxSizeOffset(xSizeOffset);
    setprevySizeOffset(ySizeOffset);
    setprevangularOffset(angularOffset);
  };

  // End Events
  useEffect(() => {
    const removeEvents = () => {
      if (!isTouchDevice()) {
        setdragging(false);
        setresizing(0);
        setrotating(false);
      }
    };
    window.addEventListener("mouseup", removeEvents);
    return () => window.removeEventListener("mouseup", removeEvents);
  }, []);

  // Make Draggable
  useEffect(() => {
    if (dragging && !resizing && !rotating) {
      setyPosOffset(prevyPosOffset + y - initMousePosition.y);
      setxPosOffset(prevxPosOffset + x - initMousePosition.x);
    }
  }, [
    dragging,
    y,
    initMousePosition.y,
    initMousePosition.x,
    x,
    resizing,
    yPosOffset,
    xPosOffset,
    prevyPosOffset,
    prevxPosOffset,
    rotating,
  ]);

  // Make Resizable
  useEffect(() => {
    if (resizing) {
      if (resizing === 1) {
        setySizeOffset(prevySizeOffset - y + initMousePosition.y);
        setxSizeOffset(prevxSizeOffset - x + initMousePosition.x);
        setyPosOffset(prevyPosOffset + y - initMousePosition.y);
        setxPosOffset(prevxPosOffset + (x - initMousePosition.x));
      }

      if (resizing === 4) {
        setySizeOffset(prevySizeOffset + y - initMousePosition.y);
        setxSizeOffset(prevxSizeOffset - x + initMousePosition.x);
        setxPosOffset(prevxPosOffset + (x - initMousePosition.x));
      }

      if (resizing === 2) {
        setySizeOffset(prevySizeOffset - y + initMousePosition.y);
        setxSizeOffset(prevxSizeOffset + x - initMousePosition.x);
        setyPosOffset(prevyPosOffset + y - initMousePosition.y);
      }

      if (resizing === 3) {
        setySizeOffset(prevySizeOffset + y - initMousePosition.y);
        setxSizeOffset(prevxSizeOffset + x - initMousePosition.x);
      }
    }
  }, [
    initMousePosition.x,
    initMousePosition.y,
    prevxPosOffset,
    prevxSizeOffset,
    prevyPosOffset,
    prevySizeOffset,
    resizing,
    x,
    y,
  ]);

  // Make Spinnable
  useEffect(() => {
    if (rotating && Wrapper.current) {
      setangularOffset(
        Math.atan2(
          x - (Wrapper.current.offsetLeft + Wrapper.current.clientWidth / 2),
          -(y - Wrapper.current.offsetTop - Wrapper.current.clientHeight / 2)
        ) *
          (180 / Math.PI)
      );
    }
  }, [prevangularOffset, rotating, x, y]);

  return (
    <div
      ref={Wrapper}
      className={`${className} ${styles.unselectable}`}
      // Handle Mouse
      onMouseDown={() => {
        if (!isTouchDevice()) {
          setinitMousePosition({ x, y });
          collectPreviousValues();
          setdragging(true);
        }
      }}
      // Handle Touch Devices
      onTouchStart={(e) => {
        setinitMousePosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
        collectPreviousValues();
      }}
      onTouchMove={() => {
        setdragging(true);
      }}
      onTouchEnd={() => {
        setdragging(false);
      }}
      // Control Styles
      style={{
        ...wrapperStyles,
        position: "fixed",
        width: `calc( ${basePosition.width} ${
          xSizeOffset > 0 ? "+" : "-"
        } ${Math.abs(xSizeOffset)}px )`,
        height: `calc( ${basePosition.height} ${
          ySizeOffset > 0 ? "+" : "-"
        } ${Math.abs(ySizeOffset)}px )`,
        top: `calc( ${basePosition.top} ${
          yPosOffset > 0 ? "+" : "-"
        } ${Math.abs(yPosOffset)}px )`,
        left: `calc( ${basePosition.left} ${
          xPosOffset > 0 ? "+" : "-"
        } ${Math.abs(xPosOffset)}px )`,
        transform: `rotate(calc( ${basePosition.rotation} ${
          angularOffset > 0 ? "+" : "-"
        } ${Math.abs(angularOffset)}deg ))`,
      }}
    >
      {/* Resize Buttons at 4 Corners */}
      <>
        {resizable ? (
          resizeHandlerStyles.map((st, index) => {
            return (
              <div
                // Handle Mouse
                onMouseDown={() => {
                  if (!isTouchDevice()) {
                    setinitMousePosition({ x, y });
                    collectPreviousValues();
                    setresizing(getResizingId(st));
                  }
                }}
                // Handle Touch Devices
                onTouchStart={(e) => {
                  setinitMousePosition({
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                  });
                  collectPreviousValues();
                }}
                onTouchMove={() => {
                  setresizing(getResizingId(st));
                }}
                onTouchEnd={() => {
                  setresizing(0);
                }}
                key={index}
                style={st}
              />
            );
          })
        ) : (
          <></>
        )}
      </>

      {/* Rotate Button */}
      <>
        {spinnable ? (
          <div
            style={spinHandlerStyle}
            // Handle Mouse
            onMouseDown={() => {
              if (!isTouchDevice()) {
                collectPreviousValues();
                setrotating(true);
              }
            }}
            // Handle Touch Devices
            onTouchStart={(e) => {
              collectPreviousValues();
            }}
            onTouchMove={() => {
              setrotating(true);
            }}
            onTouchEnd={() => {
              setrotating(false);
            }}
          />
        ) : (
          <></>
        )}
      </>

      {children}
    </div>
  );
};

export default TransWrap;
