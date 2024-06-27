import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ChatroomComponent } from './chatroom/chatroom.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'lobby', component: LobbyComponent },
    { path: 'chatRoom/:roomId', component: ChatroomComponent },
];
