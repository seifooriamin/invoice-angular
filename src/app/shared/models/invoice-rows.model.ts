export class InvoiceRowsModel {
    id: number;
    inx: number;
    invoice_id: number;
    description: string;
    comment: string;
    unit_price: number;
    unit_measure: string;
    quantity: number;
    created: Date;
    user_id: number;
}
