import { JSX } from 'react';
import { PlanItem } from '../../../types';
interface StepsProps {
    executed_toolcalls: PlanItem[] | undefined;
    planned_toolcalls: PlanItem[] | undefined;
}
declare const Steps: ({ executed_toolcalls, planned_toolcalls, }: StepsProps) => JSX.Element | null;
export default Steps;
//# sourceMappingURL=steps.d.ts.map