import { TFunction } from 'i18next';
export type AgentType = 'APIC' | 'AICS' | 'Solis';
export interface PredefinedHeader {
    key: string;
    description: string;
    type: 'text' | 'json';
    placeholder?: string;
}
export interface AgentOption {
    value: AgentType;
    label: string;
    enabled: boolean;
}
export declare const getPredefinedApicHeaders: (t: TFunction) => PredefinedHeader[];
export declare const getPredefinedAicsHeaders: (t: TFunction) => PredefinedHeader[];
export declare const getPredefinedSolisHeaders: (t: TFunction) => PredefinedHeader[];
export declare const getAgentHeadersMap: (t: TFunction) => Record<AgentType, PredefinedHeader[]>;
export declare const AGENT_OPTIONS: AgentOption[];
//# sourceMappingURL=constants.d.ts.map