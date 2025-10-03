import { createContext } from "react";
import { Trajectory } from "../OrreryTypes";


export interface TrajectoriesContextType {
    planets: Trajectory[];
    smallBodies: Trajectory[];
}

const TrajectoriesContext = createContext<TrajectoriesContextType>({
    planets: [],
    smallBodies: [],
})

export default TrajectoriesContext;
