import { PlanItem } from '../types';
/**
 * generate markdown representation of plan with executed + planned toolcalls
 * @param executed_toolcalls [] of executed toolcalls
 * @param planned_toolcalls [] of planned toolcalls
 * @returns Markdown string with checked/ unchecked items
 */
export declare const generatePlanMarkdown: (executed_toolcalls: PlanItem[], planned_toolcalls: PlanItem[], isLatestMessage: boolean) => string;
//# sourceMappingURL=planToMarkdown.d.ts.map