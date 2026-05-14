import { PlanItem } from '../../../../types';
interface ToolcallListProps {
    executed_toolcalls: PlanItem[];
    planned_toolcalls: PlanItem[];
    hideStatus?: boolean;
    disabled?: boolean;
}
declare const ToolcallList: ({ executed_toolcalls, planned_toolcalls, hideStatus, disabled, }: ToolcallListProps) => import("react/jsx-runtime").JSX.Element;
export default ToolcallList;
//# sourceMappingURL=toolcallList.d.ts.map