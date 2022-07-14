import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root',
})
export class FirebaseauthService {
  constructor(public auth: AngularFireAuth) {}
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    this.auth.signOut();
  }
  register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
}
