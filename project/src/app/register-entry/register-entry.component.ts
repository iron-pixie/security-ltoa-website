import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatTableDataSource,MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DirectiveRegistryValuesIndex } from '@angular/core/src/render3/interfaces/styling';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'register-entry',
  templateUrl: './register-entry.component.html',
  styleUrls: ['./register-entry.component.css']
})
export class RegisterEntryComponent implements OnInit {

  searchParams;

  residentSource;
  guestSource;
  residentNameSource;
  residentAddressSource;
  guestFullSort;

  displayGuestData=false;
  focusedResident;
  focusedGuest;
  imageSource="";
  searchStarted=false;
  submittingGuest=false;
  successfulRegistration=false;
  registering=false;
  getDone =false;

  keys=["guestName"];
  columnNames=["Guests"];
  pageEvent: PageEvent;

  guestsStored=["Stephen Harb","grandma","Jacob Sterling","Leon Mosby","grandma1"];
  pageingIndex=0;
  pageingLength=4; 
  tableSource;

  residentNam="";
  residentAddres="";
  phon="";
  emai="";
  specialInstruc="";

  constructor(private http:HttpClient, private router:Router) {
    this.residentNameSource = new MatTableDataSource();
    let headersVar = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

    http.get('https://d1jq46p2xy7y8u.cloudfront.net/member/all',{headers: headersVar})
      .subscribe(response => {
        let dataResponse=null;
        dataResponse=response;
        response=null;
        this.residentNameSource = new MatTableDataSource(dataResponse); 
        this.residentAddressSource = new MatTableDataSource(dataResponse);
        this.residentNameSource.filterPredicate = function(data,residentName): boolean{
          return data.memberName.toLowerCase().trim().includes(residentName);
        }
        this.residentAddressSource.filterPredicate = function(data,residentAddress): boolean{
          return data.memberAddress.toLowerCase().trim().includes(residentAddress);
        }
      })

    http.get('https://d1jq46p2xy7y8u.cloudfront.net/guest/all',{headers: headersVar})
      .subscribe(response => {
        let dataResponse=null;
        dataResponse=response;
        response=null;

        this.residentSource = new MatTableDataSource(dataResponse);
        this.guestSource = new MatTableDataSource(dataResponse);
        this.guestFullSort = new MatTableDataSource(dataResponse);

        this.tableSource=this.residentSource;

        this.paginationInitiate();
        this.getDone =true;

        this.residentSource.filterPredicate = function(data,filterGroup:FormGroup): boolean{
          let residentAddress = filterGroup.get("residentAddress").value.toLowerCase().trim();
          let residentName = filterGroup.get("residentName").value.toLowerCase().trim();
          let guestName = filterGroup.get("guestName").value.toLowerCase().trim();
          let residentAddressTrue = data.residentAddress.toLowerCase().includes(residentAddress);
          let residentNameTrue = data.residentName.toLowerCase().includes(residentName);
          let guestNameTrue = data.guestName.toLowerCase().includes(guestName);
          let index=false;
          for(let i=0;i<4;i++){
            if(!index && data.guestName.toLowerCase().trim().includes(filterGroup.get(i.toString()).value.toLowerCase().trim())){
              index=true;
            }
          }
          return residentAddressTrue && residentNameTrue && guestNameTrue && index;
        } 

        this.guestSource.filterPredicate = function(data,residentName): boolean{
          return data.residentName.toLowerCase().trim().includes(residentName);
        }

        this.guestFullSort.filterPredicate = function(data,filterGroup:FormGroup): boolean{
          let residentAddress = filterGroup.get("residentAddress").value.toLowerCase().trim();
          let residentName = filterGroup.get("residentName").value.toLowerCase().trim();
          let guestName = filterGroup.get("guestName").value.toLowerCase().trim();
          let residentAddressTrue = data.residentAddress.toLowerCase().includes(residentAddress);
          let residentNameTrue = data.residentName.toLowerCase().includes(residentName);
          let guestNameTrue = data.guestName.toLowerCase().includes(guestName);
          //return residentNameTrue;
          //return residentAddressTrue && residentNameTrue;
          //return residentAddressTrue && residentNameTrue && guestNameTrue;
          return residentAddressTrue && residentNameTrue && guestNameTrue ;
        } 

        this.residentSource.filter = this.searchParams;
        this.guestFullSort.filter = this.searchParams;
        this.pageingLength= this.guestFullSort.filteredData.length;
      })

    this.searchParams = new FormGroup({
      residentAddress:new FormControl(""),
      residentName:new FormControl(""),
      guestName:new FormControl(""),
      phone:new FormControl(""),
      0:new FormControl(""),
      1:new FormControl(""),
      2:new FormControl(""),
      3:new FormControl(""),
    });

   }

  ngOnInit() {
  }

  filterResidentData(){
    this.residentNameSource.filter = this.searchParams.get("residentName").value.toLowerCase().trim();
    this.residentAddressSource.filter = this.searchParams.get("residentAddress").value.toLowerCase().trim();
    
    if(this.residentNameSource.filteredData.length>0 && this.residentNameSource.filteredData.length<10){
      this.residentNam=this.residentNameSource.filteredData[0].memberName;
      this.residentAddres=this.residentNameSource.filteredData[0].memberAddress;
      this.phon=this.residentNameSource.filteredData[0].contactNumber;
      this.emai=this.residentNameSource.filteredData[0].email;
      let headersVar = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
      let memberJSON = {
        "memberName":this.residentNameSource.filteredData[0].memberName
      }
      this.http.post('https://d1jq46p2xy7y8u.cloudfront.net/member/instructions/search',memberJSON,{headers: headersVar})
        .subscribe(response => {
          this.specialInstruc = response["specialInstructions"];
        })
    }
    else if(this.residentAddressSource.filteredData.length>0 && this.residentAddressSource.filteredData.length<10){
      this.residentNam=this.residentAddressSource.filteredData[0].memberName;
      this.residentAddres=this.residentAddressSource.filteredData[0].memberAddress;
      this.phon=this.residentAddressSource.filteredData[0].contactNumber;
      this.emai=this.residentAddressSource.filteredData[0].email;
      let headersVar = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
      let memberJSON = {
        "memberName":this.residentAddressSource.filteredData[0].memberName
      }
      this.http.post('https://d1jq46p2xy7y8u.cloudfront.net/member/instructions/search',memberJSON,{headers: headersVar})
        .subscribe(response => {
          this.specialInstruc = response["specialInstructions"];
        })
    }
    else{
      this.residentNam="";
      this.residentAddres="";
      this.phon="";
      this.emai="";
      this.specialInstruc ="";
    }
    this.pageingIndex=0; 
    this.updatePaginationFilter();
    this.submittingGuest=false;
    this.tableSource.filter = this.searchParams;
    this.guestFullSort.filter = this.searchParams;
    this.searchStarted=true;
    this.successfulRegistration=false;
    this.pageingLength= this.guestFullSort.filteredData.length;
  }

  filterGuestData(residentName){
    this.submittingGuest=false;
    this.successfulRegistration=false
    this.guestSource.filter = residentName.toLowerCase().trim();
  }

  searchGuests(){
    this.submittingGuest=false;
    this.filterResidentData();
    this.displayGuestData =true;
  }

  residentNameClick(i){
    this.submittingGuest=false;
    this.focusedResident=this.residentSource.filteredData.filter();
    this.filterGuestData(this.focusedResident.residentName)
    this.displayGuestData =true;
    this.imageSource = "https://s3-us-west-2.amazonaws.com/ipt-photo-bucket/g"+this.focusedResident.guestName+"-"+this.focusedResident.residentAddress+".png"
  }

  guestNameClick(i){
    this.submittingGuest=true;
    this.successfulRegistration=false;
    this.focusedGuest=this.tableSource.filteredData[i];
  }

  registerEntry(){
    this.registering=true;
    this.successfulRegistration=false;
    let headersVar = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    let guestJSON = {
      "guestName":this.focusedGuest.guestName,
	    "residentName":this.focusedGuest.residentName,
	    "residentAddress":this.focusedGuest.residentAddress
    }
    this.http.post('https://d1jq46p2xy7y8u.cloudfront.net/register',guestJSON,{headers: headersVar,responseType: "text"})
      .subscribe(response => {
        this.successfulRegister();
      })
  }

  successfulRegister(){
    this.successfulRegistration=true;
    this.registering=false;
    setInterval(()=>{
      this.successfulRegistration=false;
      this.submittingGuest=false;
    },8000)
  }

  declineRegister(){
    this.submittingGuest=false;
  }

  sortDropdown(){
    this.residentNameSource.filter = this.searchParams.get("residentName").value.toLowerCase().trim();
    this.residentAddressSource.filter = this.searchParams.get("residentAddress").value.toLowerCase().trim();
    this.filterResidentData();
  }

  paginationInitiate(){
    this.searchParams.get("0").setValue(this.residentSource.filteredData[0].guestName);
    this.searchParams.get("1").setValue(this.residentSource.filteredData[1].guestName);
    this.searchParams.get("2").setValue(this.residentSource.filteredData[2].guestName);
    this.searchParams.get("3").setValue(this.residentSource.filteredData[3].guestName);
  }

  paginationChange(pageE: any){
    this.pageingIndex=pageE.pageIndex;
    this.updatePaginationFilter();
    this.pageingLength = this.guestFullSort.filteredData.length;
    this.residentSource.filter = this.searchParams;
    this.guestFullSort.filter=this.searchParams;
  }

  updatePaginationFilter(){
    for(let i=0;i<4;i++){
      if(this.guestFullSort.filteredData[this.pageingIndex*4+i]!=null && this.guestFullSort.filteredData[this.pageingIndex*4+i].guestName!=null){
        this.searchParams.get(i.toString()).setValue(this.guestFullSort.filteredData[this.pageingIndex*4+i].guestName);
      }
      else{
        this.searchParams.get(i.toString()).setValue("-2");
      }
    }
  }

}
