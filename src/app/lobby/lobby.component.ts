import { Component, NgModule, OnInit, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket'

import axios from "axios";

import base64, { decode } from "js-base64"

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent implements OnInit {

  rooms: Array<{
    _id: string;
    owner: string;
    participants: string | null;
    name: string;
    status: string;
  }> = [];

  accessToken?: string;

  userId!: string;

  ws: WebSocketSubject<any> = webSocket('ws://172.20.60.200:3000');

  constructor(private router:Router) {}

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');

    if(accessToken) {
      this.accessToken = accessToken;

      const payload = this.accessToken.split('.')[1];
        const decodedPayload = decode(payload);
        this.userId = JSON.parse(decodedPayload).sub;
    }

    console.log("userId: ", this.userId)

    this.loadChatRooms();

    let msg = {
      type: 'authenticate',
      token: this.accessToken
  };

    const observableA = this.ws.multiplex(
      () => (msg), // When server gets this message, it will start sending messages for 'A'...
      () => (null), // ...and when gets this one, it will stop.
      (message: any) => message.type === msg // If the function returns `true` message is passed down the stream. Skipped if the function returns false.
    );

    const subA = observableA.subscribe((messageForA) => {
      console.log(messageForA)
    });

    this.ws.subscribe((msg) => {
      const rooms: any[] = msg.items;
      this.rooms = rooms;
    })
  }

  async loadChatRooms(): Promise<void> {
    try {
      this.rooms = [];
      console.log('accessToken form Local Storage: ', this.accessToken);
      const res = await axios.get("http://172.20.60.200:3000/room", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
    });
      const rooms: any[] = res.data.items;
      this.rooms = rooms;
      console.log(this.rooms);
    } catch (e) {
      console.error(e);
    }
  }

  onEnterRoom(room: {
    _id: string;
    owner: string;
    participants: string | null;
    name: string;
    status: string;
  }) {
    if((room.status == 'chatting' && room.participants != this.userId && room.owner != this.userId))
      return;

    this.router.navigate(["chatRoom", room._id]);
  }

  async onCreateRoom(form: NgForm) {
    const info = await axios.post("http://172.20.60.200:3000/room", {
      name: form.value.roomName
    }, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
  })
    .then((response) => {
      if(response.status == 200) {
        form.reset();
        // alert('채팅방이 생성되었습니다.');
        // window.location.reload();
      } 
    })
    .catch(() => {
      alert("채팅방 생성이 실패하였습니다.");
    })

    // console.log('email: ', form.value.email)
    // console.log('password: ', form.value.password)
  }

  async onDeleteRoom(_id: string) {
    const info = await axios.delete(`http://172.20.60.200:3000/room/`+ _id, {
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
