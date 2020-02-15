export class InvoiceGeneralSettingModel {
    id: number;
    user_id: number;
    currency: string;
    created: Date;
    modified: Date;
    deduction1status: number;
    deduction1label: string;
    deduction1type: string;
    deduction1percentage: number;
    deduction2status: number;
    deduction2label: string;
    deduction2type: string;
    deduction2percentage: number;
    addition1status: number;
    addition1label: string;
    addition1type: string;
    addition1percentage: number;
    addition2status: number;
    addition2label: string;
    addition2type: string;
    addition2percentage: number;
    addition3status: number;
    addition3label: string;
    addition3type: string;
    addition3percentage: number;
}
