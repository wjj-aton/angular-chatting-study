import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router} from '@angular/router';

import axios from "axios";

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent implements OnInit {
  constructor(private router:Router) { }

  rooms: Array<{
    _id: string;
    owner: string;
    name: string;
    status: string;
  }> = [];

  accessToken = localStorage.getItem('accessToken');

  ngOnInit() {
    this.loadChatRooms();
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
      // this.chat_rooms = rooms.map((room, idx) => {
      //   return {
      //     id: room._id,
      //     title: room.title,
      //     master: room.master[0].name,
      //   };
      // });
    } catch (e) {
      console.error(e);
    }
  }

  async onCreateRoom(form: NgForm) {
    console.log('채팅방 생성!', form.value.roomName);
    
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
        this.router.navigate([`login`]);
      } 
    })
    .catch(() => {
      alert("채팅방 생성이 실패하였습니다.");
    })

    // console.log('email: ', form.value.email)
    // console.log('password: ', form.value.password)
  }

}
