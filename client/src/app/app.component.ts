import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client.hello word ~~';
  users: any;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    // this.getUsers();
    this.setCurrentUser()
  }

  setCurrentUser() {


    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.accountService.setCurrentUser(user);
    } else {
      this.accountService.setCurrentUser(undefined);
    }



    // const user: User = JSON.parse(localStorage.getItem('user') ?? '');
    // this.accountService.setCurrentUser(user);


    //this from the classroom but no work i try the othen one!
    // const user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
    // console.log(user);
    // if (user) {
    // this.accountService.setCurrentUser(user);
    // console.log('11111');
    // }

    // const lsUser = localStorage.getItem('user');
    // console.log(lsUser);

    // if (lsUser !== 'undefined' || lsUser !== null) {
    //   const user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
    //   this.accountService.setCurrentUser(user);
    //   console.log('1111111111')
    // }
    //end!!


  }

  // getUsers() {
  //   this.http.get("https://localhost:5001/api/users").subscribe(response => {
  //     this.users = response;
  //   }, error => {
  //     console.log(error);
  //   })
  // }
}
