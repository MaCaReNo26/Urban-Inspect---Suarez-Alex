import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, 
  IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, 
  ModalController, ToastController, IonBadge, IonImg 
} from '@ionic/angular';
import { Incident } from '../../models/incident.model';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-detalle-incidencia',
  templateUrl: './detalle-incidencia.component.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonSelect, 
    IonSelectOption, IonTextarea, IonBadge, IonImg
  ]
})
export class DetalleIncidenciaComponent implements OnInit {
  @Input() incident!: Incident;
  nuevoEstado!: 'Pendiente' | 'En Proceso' | 'Resuelta';
  observacion: string = '';

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.nuevoEstado = this.incident.status;
    this.observacion = this.incident.observation || '';
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async actualizarEstado() {
    // R9: Reglas de estado y observación obligatoria
    if (this.nuevoEstado === 'Resuelta' && (!this.observacion || this.observacion.trim() === '')) {
      const toast = await this.toastCtrl.create({
        message: 'Debe ingresar una observación para resolver la incidencia.',
        duration: 2500,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const updates: Partial<Incident> = {
      status: this.nuevoEstado,
      observation: this.nuevoEstado === 'Resuelta' ? this.observacion : ''
    };

    this.apiService.updateIncident(this.incident.id!, updates).subscribe({
      next: async (res) => {
        const toast = await this.toastCtrl.create({
          message: 'Estado actualizado correctamente.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        
        this.incident = { ...this.incident, ...updates };
        this.modalCtrl.dismiss({ updated: true, incident: this.incident });
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Error al actualizar. Intente nuevamente.',
          duration: 2500,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}