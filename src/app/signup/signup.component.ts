import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet, RouterModule, Router} from '@angular/router';

import axios from "axios";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private router:Router) { }

  async onSignUp(form: NgForm) {
    
    const info = await axios.post("http://172.20.60.200:3000/auth/register", {
      email: form.value.email,
      password: form.value.password,
      name: form.value.name
    })
    .then((response) => {
      if(response.status == 200) {
        alert('회원가입에 성공하였습니다.');
        this.router.navigate([`login`]);
      } 
    })
    .catch(() => {
      alert("회원가입에 실패하였습니다.");
    })

    // console.log('email: ', form.value.email)
    // console.log('password: ', form.value.password)
  }
}
