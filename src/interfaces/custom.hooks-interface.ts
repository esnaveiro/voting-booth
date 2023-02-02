import { Dispatch, SetStateAction } from "react";

export interface IUseCollapse {
    reference: React.RefObject<HTMLDivElement>;
    isCollapsed: boolean;
    setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}