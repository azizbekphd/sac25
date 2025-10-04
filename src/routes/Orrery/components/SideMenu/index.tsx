import { FocusContext } from "../../contexts";
import { FiltersMenu, BodiesTable } from "../index";
import SelectedBody from "../SelectedBody";
import "./index.css";
import { useContext, useEffect, useRef, useState } from "react";

const [speedMin, speedMax] = [1, 250];
const [angleMin, angleMax] = [5, 90];

const SideMenu: React.FC = () => {
  const [show, setShow] = useState<boolean>(true);
  const { selected } = useContext(FocusContext);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<number>(38);
  const [angle, setAngle] = useState<number>(45);

  useEffect(() => {
    if (!selected.objectId) {
      document.title = "Orrery";
    } else {
      sideMenuRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selected.objectId]);

  return (
    <>
      <div className={`side-menu-wrapper ${show ? "show" : ""}`}>
        <div className="side-menu" ref={sideMenuRef}>
          {selected.objectId ? (
            <SelectedBody />
          ) : (
            <>
              <h2>Menu</h2>

              <FiltersMenu />
              <BodiesTable />
            </>
          )}
        </div>
        <button className="side-menu-toggler" onClick={() => setShow(!show)}>
          {show ? "Close" : "Menu"}
        </button>
      </div>
      <div className="slider-input-wrapper">
        <div className="slider-title-wrapper">
          <div className="slider-title-name">Speed:</div>
          <div>{speed},000 mph</div>
        </div>
        <input
          type="range"
          min={speedMin}
          max={speedMax}
          value={speed}
          step={1}
          onChange={(e) => {
            setSpeed(parseInt(e.target.value));
          }}
          name=""
          id=""
        />
        <div className="slider-title-wrapper">
          <div className="slider-title-name">Impact angle:</div>
          <div>{angle}°</div>
        </div>
        <input
          type="range"
          min={angleMin}
          max={angleMax}
          value={angle}
          step={1}
          onChange={(e) => {
            setAngle(parseInt(e.target.value));
          }}
          name=""
          id=""
        />
      </div>
    </>
  );
};

export default SideMenu;
