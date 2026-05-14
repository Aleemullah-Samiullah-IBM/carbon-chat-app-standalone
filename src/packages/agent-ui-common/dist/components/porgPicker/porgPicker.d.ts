import { FrontendContext } from '../../interfaces/platform';
interface PorgPickerProps {
    vscode?: any;
    frontendClient?: FrontendContext;
    accessToken?: any;
    setShowAPIMSelection?: (value: boolean) => void;
    onPorgSelectedCallback?: (value: any) => void;
}
export default function PorgPicker({ vscode, frontendClient, accessToken, setShowAPIMSelection, onPorgSelectedCallback, }: Readonly<PorgPickerProps>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=porgPicker.d.ts.map