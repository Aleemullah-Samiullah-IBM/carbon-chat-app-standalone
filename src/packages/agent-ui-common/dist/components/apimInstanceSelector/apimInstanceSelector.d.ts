export interface ApimInstance {
    id: string;
    name: string;
    url: string;
    access_token: string;
}
export interface ApimInstanceSelectorProps {
    instances?: ApimInstance[];
    apimInstances?: ApimInstance[];
    onInstanceSelect: (instance: ApimInstance) => void;
    isLoading?: boolean;
    initialSelectedInstance?: ApimInstance;
}
export default function ApimInstanceSelector({ instances, apimInstances, onInstanceSelect, isLoading, initialSelectedInstance, }: Readonly<ApimInstanceSelectorProps>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=apimInstanceSelector.d.ts.map