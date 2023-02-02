import { useState, useEffect, useRef } from 'react';
import { IUseCollapse } from '../interfaces/custom.hooks-interface';

/**
 * Custom hook used to add an event listener where a click outside of a given
 * reference it will change its state to collapsed true
 * @param initialState
 */
export default function useCollapse(initialState: boolean): IUseCollapse {
    const [isCollapsed, setIsCollapsed] = useState(initialState);
    const reference = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: { target: any; }) => {
        if (reference.current && !reference.current.contains(event.target)) {
            setIsCollapsed(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { reference, isCollapsed, setIsCollapsed };
}
