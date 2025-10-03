import { createXRStore, type XRStore } from "@react-three/xr";
import { createContext } from "react";

const XRContext = createContext<XRStore>(createXRStore());
export default XRContext;
