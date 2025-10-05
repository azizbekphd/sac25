import { createContext } from "react";
import config from "../globals/config.json";

interface ImpactParams {
    lng: number;
    lat: number;
    speed: number;
    angle: number;
}

interface ImpactParamsContextType {
    params: ImpactParams;
    setImpactParams: (params: ImpactParams) => void;
}

const ImpactParamsContext = createContext<ImpactParamsContextType>({
    params: config.impactParams.default,
    setImpactParams: () => {},
});

export default ImpactParamsContext;
export { type ImpactParams };