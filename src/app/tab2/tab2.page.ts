import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, 
  IonTextarea, ToastController, AlertController, IonCard, IonCardContent , IonText
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { Incident } from '../models/incident.model';
import { addIcons } from 'ionicons';
import { cameraOutline, locationOutline, saveOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, 
    IonIcon, IonTextarea, IonCard, IonCardContent, IonText
  ]
})
export class Tab2Page implements OnInit {
  incidentData: Partial<Incident> = {
    code: 'INC-' + Math.floor(Math.random() * 10000),
    type: '',
    description: '',
    address: '',
    sector: '',
    priority: 'Baja',
    status: 'Pendiente',
    date: new Date().toISOString()
  };

  weather: any = null;
  weatherWarning = '';

  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ cameraOutline, locationOutline, saveOutline, trashOutline });
  }

  async ngOnInit() {
    // R8: Recuperación de registro incompleto
    const draft = await this.storage.getDraftForm();
    if (draft) {
      const alert = await this.alertCtrl.create({
        header: 'Registro Incompleto',
        message: 'Tienes una incidencia sin guardar. ¿Deseas continuarla?',
        backdropDismiss: false,
        buttons: [
          { text: 'Descartar', role: 'cancel', handler: () => this.storage.clearDraftForm() },
          { text: 'Continuar', handler: () => { this.incidentData = draft; } }
        ]
      });
      await alert.present();
    }
  }

  async saveDraft() {
    await this.storage.saveDraftForm(this.incidentData);
  }

  // R7: Ubicación obligatoria para Baches
  async getLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.incidentData.latitude = coordinates.coords.latitude;
      this.incidentData.longitude = coordinates.coords.longitude;
      await this.saveDraft();
      this.fetchWeather();
    } catch (e) {
      this.showToast('No se pudo acceder al GPS. Ingresa coordenadas manualmente si es un bache.');
    }
  }

  // R4: Consulta meteorológica externa
  fetchWeather() {
    if (this.incidentData.latitude && this.incidentData.longitude) {
      this.apiService.getWeather(this.incidentData.latitude, this.incidentData.longitude).subscribe({
        next: (res) => {
          const current = res.current;
          // Validación para evitar variables vacías
          this.weather = {
            temperature: current.temperature_2m || 0,
            precipitation: current.precipitation || 0
          };
          
          if (this.weather.precipitation > 5) {
            this.weatherWarning = 'Advertencia: Lluvia intensa (> 5mm). Las condiciones dificultan el mantenimiento.';
          } else {
            this.weatherWarning = '';
          }
        },
        error: () => {
          this.showToast('Servicio meteorológico no disponible. Puedes continuar.');
        }
      });
    }
  }

  // R6: Evidencia fotográfica 
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 30, // Reducimos drásticamente la calidad al 30%
        width: 400,  // Reducimos el ancho a 400px (suficiente para evidencia)
        height: 400, // Reducimos la altura a 400px
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.incidentData.photoUrl = image.dataUrl;
      await this.saveDraft();
    } catch (e) {
      this.showToast('Captura de foto cancelada o permiso denegado.');
    }
  }

  // R5: Registro de incidencia
  async submitIncident() {
    // Validaciones
    if (!this.incidentData.type || !this.incidentData.description || !this.incidentData.address) {
      return this.showToast('Completa los campos obligatorios.');
    }

    if (this.incidentData.type === 'Bache' && (!this.incidentData.latitude || !this.incidentData.longitude)) {
      return this.showToast('La ubicación es obligatoria para los baches (R7).');
    }

    if (this.incidentData.priority === 'Alta' && !this.incidentData.photoUrl) {
      return this.showToast('La fotografía es obligatoria para prioridad Alta (R5).');
    }

    // Guardar en la API
    this.apiService.createIncident(this.incidentData as Incident).subscribe({
      next: async () => {
        this.showToast('Incidencia guardada exitosamente');
        await this.storage.clearDraftForm();
        this.resetForm();
      },
      error: async (err) => {
        // AQUÍ IMPRIMIMOS EL ERROR EXACTO EN PANTALLA
        const msgError = err.message ? err.message : JSON.stringify(err);
        const alert = await this.alertCtrl.create({
          header: 'Fallo al guardar',
          subHeader: 'Detalle del error devuelto por la API:',
          message: msgError,
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    });
  }

  resetForm() {
    this.incidentData = { code: 'INC-' + Math.floor(Math.random() * 10000), priority: 'Baja', status: 'Pendiente', type: '', description: '', address: '', sector: '' };
    this.weather = null;
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 3000, position: 'bottom' });
    toast.present();
  }
}