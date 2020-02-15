import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '-';

    parse(value: string): NgbDateStruct {
        let result: NgbDateStruct = null;
        if (value) {
            const date = value.split(this.DELIMITER);
            result = {
                year : parseInt(date[0], 10),
                month : parseInt(date[1], 10),
                day : parseInt(date[2], 10)
            };
        }
        return result;
    }

    format(date: NgbDateStruct): string {
        let result: string = null;
        let dd;
        let mm;
        if (date) {
            if (date.day < 10) {
                dd = '0' + date.day;
            } else {
                dd = date.day;
            }
            if (date.month < 10) {
                mm = '0' + date.month;
            } else {
                mm = date.month;
            }
            result = date.year + this.DELIMITER + mm + this.DELIMITER + dd;
        }
        return result;
    }

}
