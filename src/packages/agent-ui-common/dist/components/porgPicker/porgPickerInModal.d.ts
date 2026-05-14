import { POrgName } from '../../types/POrgName';
import { FrontendContext } from '../../interfaces/platform';
interface PorgPickerInModalProps {
    onPorgSelectedCallback?: (value: any) => void;
    selectedPorg?: POrgName;
    isOpen?: boolean;
    vscode?: any;
    frontendClient?: FrontendContext;
    accessToken?: any;
}
export default function PorgPickerInModal({ selectedPorg, onPorgSelectedCallback, isOpen, vscode, frontendClient, accessToken, }: Readonly<PorgPickerInModalProps>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=porgPickerInModal.d.ts.map