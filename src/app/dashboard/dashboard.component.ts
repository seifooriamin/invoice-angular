import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string;
  optionsSelect: Array<any>;

  // Chart one variable
  public chartType1: string = 'bar';

  public chartDatasets1: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40, 11, 22, 33, 44, 55], label: 'My First dataset' }
  ];

  public chartLabels1: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public chartColors1: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(0, 204, 0,0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        '#00cc00'
      ],
      borderWidth1: 2,
    }
  ];

  public chartOptions1: any = {
    responsive: true
  };
  public chartClicked1(e: any): void { }
  public chartHovered1(e: any): void { }
  // End of chart one variable

  // Chart two variable
  public chartType2: string = 'bar';

  public chartDatasets2: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40, 11, 22, 33, 44, 55], label: 'My First dataset' }
  ];

  public chartLabels2: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public chartColors2: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(0, 204, 0,0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        '#00cc00'
      ],
      borderWidth2: 2,
    }
  ];

  public chartOptions2: any = {
    responsive: true
  };
  public chartClicked2(e: any): void { }
  public chartHovered2(e: any): void { }
  // End of chart one variable

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('first_name');
    this.optionsSelect = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];
  }




}
