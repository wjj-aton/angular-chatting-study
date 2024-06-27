import { Component, NgModule, OnInit, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket'

import axios from "axios";

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
    name: string;
    status: string;
  }> = [];

  accessToken?: string;

  ws: WebSocketSubject<any> = webSocket('ws://172.20.60.200:3000');

  constructor(private router:Router) {}

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');

    if(accessToken)
      this.accessToken = accessToken;

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
    } catch (e) {
      console.error(e);
    }
  }

  onEnterRoom(id: string) {
    this.router.navigate(["chatRoom", id]);
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
        alert('채팅방이 생성되었습니다.');
        window.location.reload();
      } 
    })
    .catch(() => {
      alert("채팅방 생성이 실패하였습니다.");
    })

    // console.log('email: ', form.value.email)
    // console.log('password: ', form.value.password)
  }

}
