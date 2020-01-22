export class InvoiceModel {
    id: number;
    inx: number;
    invoice_id: number;
    description: string;
    comment: string;
    unit_price: number;
    unit_measure: string;
    total_row_price: number;
    quantity: number;
    created: Date;
    user_id: number;
}
