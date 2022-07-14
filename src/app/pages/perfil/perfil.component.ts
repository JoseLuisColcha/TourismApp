import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Client } from 'src/app/models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  client: Client = {
    uid: '',
    name: '',
    email: '',
    phoneNumber: '',
    image: '',
    description: '',
    ubication: '',
  };

  newFile: any;
  constructor(public menucontroler: MenuController) {}

  ngOnInit() {}

  openMenu() {
    this.menucontroler.toggle('first');
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        this.client.image = image.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  register() {}
}
