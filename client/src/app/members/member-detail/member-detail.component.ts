import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent
  member: Member = {} as Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab?: TabDirective;
  messages: Message[] = [];
  user?: User;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private messageService: MessageService, public presenceService: PresenceService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  // loadMenber() {
  //   this.membersService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
  //     this.member = member;
  //     this.galleryImages = this.getImages();
  //   })
  // }


  ngOnInit(): void {
    // this.loadMenber();
    // this.route.data.subscribe(data => {
    //   this.member = data.member
    // })

    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
      // // max-width 800
      // {
      //   breakpoint: 800,
      //   width: '100%',
      //   height: '600px',
      //   imagePercent: 80,
      //   thumbnailsPercent: 20,
      //   thumbnailsMargin: 20,
      //   thumbnailMargin: 20
      // },
      // // max-width 400
      // {
      //   breakpoint: 400,
      //   preview: false
      // }
    ];
    this.galleryImages = this.getImages();

  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  getImages(): NgxGalleryImage[] {
    const imagesUrls = [];
    for (const photo of this.member.photos) {
      imagesUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imagesUrls;
  }


  selectTab(heading: string) {
    if (this.memberTabs) {
      // console.log(heading);
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      // this.loadMessages();
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
