import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatTableDataSource,MatPaginator } from '@angular/material';
import { MatSort, MatSortable } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'table-ui-entry',
  templateUrl: './table-ui-entry.component.html',
  styleUrls: ['./table-ui-entry.component.css']
})
export class TableUiEntryComponent implements OnInit {

  keys;
  columnNames;
  dataArray:any[]=[];
  entrySource;
  pageingLength;
  index=0;
  done=false;
  dataResponse;
  constructor(private http:HttpClient, private router:Router) { 
    this.columnNames = ["Guest Name","Resident Address","Resident Name","Time of entry"];
    this.keys = ['guestName','residentAddress','residentName','entryTime'];

    let headersVar = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

    http.get('https://d1jq46p2xy7y8u.cloudfront.net/register/all',{headers: headersVar})
      .subscribe(response => {
        this.dataResponse=null;

        this.dataResponse=response;
        response=null;

        this.entrySource = new MatTableDataSource(this.dataResponse);

        let sort: MatSort = new MatSort;
        this.entrySource.sort=sort;
        sort.sort({
          id: "entryTime",
          start: 'desc'
        }as MatSortable);
        this.done=true;
      })
  }

  ngOnInit(){
  }

}
