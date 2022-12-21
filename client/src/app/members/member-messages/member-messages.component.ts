
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() username?: string;
  // messages: Message[] = [];
  // @Input() messages: Message[] = [];
  messageContent = '';
  loading = false;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
    // this.loadMessages();
  }

  sendMessage() {
    if (!this.username) return;
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    }).finally(() => this.loading = false);
  }

  //move this function to member-detail.component.ts
  // loadMessages() {
  //   if (this.username) {
  //     this.messageService.getMessageThread(this.username).subscribe({
  //       next: messages => this.messages = messages
  //     })
  //   }
  // }
}
