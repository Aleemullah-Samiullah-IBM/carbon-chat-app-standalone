import { JSX } from 'react';
interface PlanProps {
    nonEditable?: boolean;
    plan?: any;
    instance?: any | undefined;
    onSpecialSave?: (type: string, data: any, instance?: any | undefined) => Promise<void> | void;
    title?: string;
    onSave?: () => void;
    setIsEditPage?: (e: boolean) => void;
    isApprovalSubmitting?: boolean;
}
declare const Plan: ({ title, nonEditable, plan: planProp, instance, onSpecialSave, onSave, setIsEditPage, isApprovalSubmitting: isApprovalSubmittingProp, }: PlanProps) => JSX.Element | null;
export default Plan;
//# sourceMappingURL=plan.d.ts.map