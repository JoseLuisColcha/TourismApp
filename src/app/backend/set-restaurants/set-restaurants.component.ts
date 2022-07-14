import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { GooglemapsComponent } from 'src/app/googlemaps/googlemaps.component';
import { Client, Restaurant } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-restaurants',
  templateUrl: './set-restaurants.component.html',
  styleUrls: ['./set-restaurants.component.scss'],
})
export class SetProductosComponent implements OnInit {
  restaurants: Restaurant[] = [];

  newRestaurant: Restaurant;

  enableNewRestaurant = false;

  private path = 'Restaurantes/';
  newImage = '';
  newFile = '';

  loading: any;

  cliente: Client = {
    uid: '',
    name: '',
    email: '',
    phoneNumber: '',
    image: '',
    description: '',
    ubication: null,
  };

  constructor(
    public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageService: FirestorageService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getItems();
  }

  openMenu() {
    this.menucontroler.toggle('first');
  }
  async saveItem() {
    this.presentLoading();
    const path = 'Restaurantes';
    const name = this.newRestaurant.name;
    const res = await this.firestorageService.uploadImage(
      this.newFile,
      path,
      name
    );
    this.newRestaurant.image = res;
    this.firestoreService
      .createDoc(this.newRestaurant, this.path, this.newRestaurant.id)
      .then((res) => {
        this.loading.dismiss();
        this.presentToast('Guardado con éxito');
      })
      .catch((err) => {
        this.presentToast('No se pudo guardar :(');
      });
  }

  getItems() {
    this.firestoreService
      .getCollection<Restaurant>(this.path)
      .subscribe((res) => {
        this.restaurants = res;
      });
  }
  async deleteItem(restaurant: Restaurant) {
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: 'Seguro desea <strong>eliminar<strong>!',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirmar cancelar');
          },
        },
        {
          text: 'OK',
          handler: () => {
            console.log('Confirmar OK');
            this.firestoreService
              .deleteDoc(this.path, restaurant.id)
              .then((res) => {
                this.loading.dismiss();
                this.presentToast('Eliminado con éxito');
              })
              .catch((err) => {
                this.presentToast('No se pudo eliminar :(');
              });
          },
        },
      ],
    });

    await alert.present();
    //
  }

  newItem() {
    this.enableNewRestaurant = true;

    this.newRestaurant = {
      name: '',
      price: null,
      description: '',
      image: '',
      ubication: null,
      id: this.firestoreService.getId(),
      fecha: new Date(),
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'normal',
      color: 'Light',
    });
    toast.present();
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        this.newRestaurant.image = image.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async addDirection() {
    const location = this.newRestaurant.ubication;
    let positionInput = {
      lat: 0,
      lng: 0,
    };
    if (location !== null) {
      positionInput = location;
    }

    const modalAdd = await this.modalController.create({
      component: GooglemapsComponent,
      componentProps: { position: positionInput },
    });
    await modalAdd.present();

    const { data } = await modalAdd.onWillDismiss();
    if (data) {
      console.log('data -> ', data);
      this.newRestaurant.ubication = data.pos;
      console.log('this.newRestaurant -> ', this.newRestaurant);
    }
  }
}
