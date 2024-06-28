import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import base64, { decode } from "js-base64"

import axios from "axios";

import { Observable, Subscription } from 'rxjs';

import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions,
  MqttService
} from 'ngx-mqtt';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent implements OnInit {
  chats: Array<{
    talker: string;
    message: string;
    _id: string;
  }> = [];

  roomId!: string;
  ownerId!: string;
  userId!: string;

  accessToken = localStorage.getItem('accessToken');

  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;

  private subscription?: Subscription;
  message: any;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private _location: Location,
    private _mqttService: MqttService) {
      this.roomId = route.snapshot.params['roomId'];

      if(this.accessToken) {
        const payload = this.accessToken.split('.')[1];
        const decodedPayload = decode(payload);
        this.userId = JSON.parse(decodedPayload).sub;
      }
    }

  ngOnInit(): void {
    this.onEnterRoom(this.roomId);
  }

  async onEnterRoom(id: string) {
    const info = await axios.get(`http://172.20.60.200:3000/room/`+ id, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
  })
    .then((response) => {
      console.log(response.data.item);
      if(response.status == 200) {
        // alert('채팅방에 입장하였습니다..');
      } 
      this.chats = response.data.item.chat;
      this.ownerId = response.data.item.owner.id;
    })
    .catch(() => {
      // alert("채팅방 입장에 실패하였습니다.");
      this.router.navigate([`login`]);
    })

    this.subscription = this._mqttService.observe(`chat/room/${this.roomId}`).subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();

      console.log(this.message);

      let obj = JSON.parse(this.message);

      this.chats.push(obj);
    });

  }

  onClickSend(form: NgForm) {
    console.log("메시지 내용: ", form.value.message);
    const jsonData = {
      talker: this.userId,
      message: form.value.message,
      roomId: this.roomId
    }
    
    this._mqttService.unsafePublish(`chat/room/${this.roomId}`, JSON.stringify(jsonData), {qos: 1, retain: true});
    this._mqttService.unsafePublish(`chat/room/all`, JSON.stringify(jsonData), {qos: 1, retain: true});

    form.reset();

    setTimeout(() => {
      if(this.myScrollContainer)
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight + 2000;
    }, 100);
    
  }

  async onDeleteRoom() {
    const info = await axios.delete(`http://172.20.60.200:3000/room/`+ this.roomId, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
  })
    .then((response) => {
      if(response.status == 200) {
        // alert('채팅방이 삭제되었습니다.');
        this.router.navigate([`lobby`]);
      } 
    })
    .catch(() => {
      // alert("채팅방 삭제에 실패하였습니다.");
    })
  }
}
