import { default as React } from 'react';
interface SelectionTableProps {
    selectionType: 'none' | 'selection' | 'multi-selection';
    title?: string;
    origHeaders: any[];
    origRows: any[];
    preSelectedRows?: number[];
    nonEditable?: boolean;
    onSave: (index: number | number[]) => void;
}
declare const SelectionTable: React.FC<SelectionTableProps>;
export default SelectionTable;
//# sourceMappingURL=selectionTable.d.ts.map