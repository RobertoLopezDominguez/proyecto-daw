import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public page_title: string;

  constructor() { 
    this.page_title = 'Administración';
  }

  ngOnInit(): void {
  }

}
