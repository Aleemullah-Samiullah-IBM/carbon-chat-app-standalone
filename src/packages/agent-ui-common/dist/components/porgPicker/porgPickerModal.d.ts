import { ApimInstance } from '../apimInstanceSelector';
import { FrontendContext } from '../../interfaces/platform';
interface PorgPickerModalProps {
    open: boolean;
    parentContext?: any;
    frontendClient?: FrontendContext;
    onClose: () => void;
    vscode?: any;
    accessToken?: any;
    onPorgSelectedCallback?: (value: any, apimInstance?: ApimInstance) => void;
    selectedAPIMInstance?: any;
    setSelectedAPIMInstance?: any;
}
export default function PorgPickerModal({ open, parentContext, frontendClient, onClose, vscode, accessToken, onPorgSelectedCallback, selectedAPIMInstance, setSelectedAPIMInstance, }: Readonly<PorgPickerModalProps>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=porgPickerModal.d.ts.map