import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  imageAccept(imageType: string) {
    if ((imageType === 'image/gif') || (imageType === 'image/jpeg') || (imageType === 'image/png')) {
      return true;
    } else {
      return false;
    }
  }
  imageSize(imageSize) {
    if (imageSize <= 2097152) {
      return true;
    } else {
      return  false;
    }
  }
}
