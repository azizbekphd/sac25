import { ImpactParamsContext } from "../../contexts";
import { useContext } from "react";
import "./index.css";
import config from "../../globals/config.json";
const [speedMin, speedMax] = config.impactParams.speedRange;
const [angleMin, angleMax] = config.impactParams.angleRange;

const Slider: React.FC = () => {
  const impactParams = useContext(ImpactParamsContext);
  return (
    <div className="slider-input-wrapper">
      <div className="slider-title-wrapper">
        <div className="slider-title-name">Speed:</div>
        <div>{impactParams.params.speed},000 mph</div>
      </div>
      <input
        type="range"
        min={speedMin}
        max={speedMax}
        value={impactParams.params.speed}
        step={1}
        onChange={(e) => {
          impactParams.params.speed = parseInt(e.target.value);
        }}
        name=""
        id=""
      />
      <div className="slider-title-wrapper">
        <div className="slider-title-name">Impact angle:</div>
        <div>{impactParams.params.angle}°</div>
      </div>
      <input
        type="range"
        min={angleMin}
        max={angleMax}
        value={impactParams.params.angle}
        step={1}
        onChange={(e) => {
          impactParams.params.angle = parseInt(e.target.value);
        }}
        name=""
        id=""
      />
    </div>
  );
};

export default Slider;