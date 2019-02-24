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
  dataSource;
  pageingLength;
  index=0;
  done=false;

  constructor(private http:HttpClient, private router:Router) { 
    this.columnNames = ["Guest Name","Resident Address","Resident Name","Time of entry"];
    this.keys = ['guestName','residentAddress','residentName','entryTime'];

    let headersVar = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

    http.get('https://d1jq46p2xy7y8u.cloudfront.net/register/all',{headers: headersVar})
      .subscribe(response => {
        let dataResponse=null;

        dataResponse=response;
        response=null;

        

        for(let data of dataResponse){
          this.dataArray.push(data);
        }
        this.pageingLength = this.dataArray.length;
        this.dataSource = new MatTableDataSource(this.dataArray);
        this.dataSource.filterPredicate = function(dat,pageinationNumber): boolean{
          let boo = false;
          console.log("oob");
          console.log(this.dataSource);
          console.log(dat);
          for(let i=this.pageinationNumber*8;i<this.pageinationNumber*8+8;i++){
            console.log(this.dataSource[i]);
            console.log(dat)
            if(this.dataSource[i]===dat){
              boo=true;
              console.log("boo");
            }
          }
          return boo;
        }
        console.log(this.dataSource);
        this.dataSource.filter = 0;
        let sort: MatSort = new MatSort;
        this.dataSource.sort=sort;
        sort.sort({
          id: "entryTime",
          start: 'desc'
        }as MatSortable);
        this.done=true;
        this.dataSource.filter = 0;
      })
  }

  ngOnInit(){
  }

  paginationChange(pageE: any){
    this.index=pageE.pageIndex;
    this.dataSource.filter=pageE.pageIndex;
  }

}
