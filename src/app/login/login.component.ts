import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import axios from "axios";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router:Router) { }
  
  async onAddPost(form: NgForm) {
    
    const info = await axios.post("http://172.20.60.200:3000/auth/login", {
      email: form.value.email,
      password: form.value.password
    })
    .then((response) => {
      console.log(response.data.item.accessToken);

      localStorage.setItem("accessToken", response.data.item.accessToken);

      this.router.navigate([`lobby`]);
    })
    .catch(() => {
      alert('로그인에 실패하였습니다.');
      form.reset();
    });

    // console.log('email: ', form.value.email)
    // console.log('password: ', form.value.password)
  }
}
