import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import axios from "axios";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'chatting-app';

  async onAddPost(form: NgForm) {
    
    const info = await axios.post("http://172.20.60.200:3000/auth/login", {
      email: form.value.email,
      password: form.value.password
    }).then(
      response => console.log(response)
    );

    console.log('email: ', form.value.email)
    console.log('password: ', form.value.password)
  }
}
