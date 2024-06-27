import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import base64, { decode } from "js-base64"

import axios from "axios";

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [CommonModule],
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

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private _location: Location) {
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
        alert('채팅방에 입장하였습니다..');
      } 
      this.chats = response.data.item.chat;
      this.ownerId = response.data.item.owner.id;
    })
    .catch(() => {
      alert("채팅방 입장에 실패하였습니다.");
      this._location.back();
    })
  }

  async onDeleteRoom() {
    const info = await axios.delete(`http://172.20.60.200:3000/room/`+ this.roomId, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
  })
    .then((response) => {
      if(response.status == 200) {
        alert('채팅방이 삭제되었습니다.');
        this.router.navigate([`lobby`]);
      } 
    })
    .catch(() => {
      alert("채팅방 삭제에 실패하였습니다.");
    })
  }
}
