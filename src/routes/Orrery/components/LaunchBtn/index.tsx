import "./index.css";
import { useCallback, useContext, useMemo } from "react";
import { FocusContext, ImpactParamsContext, TrajectoriesContext } from "../../contexts";
import { useNavigate } from "react-router-dom";

const LaunchBtn: React.FC = () => {
  const navigate = useNavigate();
  const { selected } = useContext(FocusContext);
  const trajectories = useContext(TrajectoriesContext);
  const impactParams = useContext(ImpactParamsContext);
  const isLaunchActive = useMemo(
    () =>
      selected.objectId &&
      trajectories.planets.findIndex((v) => v.id === selected.objectId) === -1,
    [selected.objectId, trajectories.planets]
  );
  const clickHandler = useCallback(() => {
    
    if (isLaunchActive) {
      const diameter = trajectories.smallBodies.find((v) => v.id === selected.objectId)
        ?.diameter.toString();
      if (!diameter) return;
      const params = new URLSearchParams({
        diameter,
        speed: impactParams.params.speed.toString(),
        angle: impactParams.params.angle.toString(),
        lat: impactParams.params.lat.toString(),
        lng: impactParams.params.lng.toString(),
      }).toString();

      navigate(`./impact?${params}`);
    }
  }, [isLaunchActive]);
  return (
    <button
      disabled={!isLaunchActive}
      onClick={clickHandler}
      className={`launch-button ${isLaunchActive ? "active" : ""}`}
    >
      {isLaunchActive ? "Launch Asteroid" : "Select Asteroid"}
    </button>
  );
};

export default LaunchBtn;
