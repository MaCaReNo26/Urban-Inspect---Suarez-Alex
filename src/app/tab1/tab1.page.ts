import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonButton, IonIcon,
  IonSpinner, ModalController, IonThumbnail, IonText, IonRefresher, IonRefresherContent
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmark, bookmarkOutline, eyeOutline } from 'ionicons/icons';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { Incident } from '../models/incident.model';
import { DetalleIncidenciaComponent } from '../components/detalle-incidencia/detalle-incidencia.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonBadge, IonInfiniteScroll,
    IonInfiniteScrollContent, IonButton, IonIcon, IonSpinner, IonThumbnail, IonText,
    IonRefresher, IonRefresherContent
  ]
})
export class Tab1Page implements OnInit {
  incidents: Incident[] = [];
  trackedIds: string[] = [];
  page = 1;
  isLoading = false;
  hasError = false;

  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ bookmark, bookmarkOutline, eyeOutline });
  }



  recargarLista(event: any) {
    this.page = 1;
    this.hasError = false;

    this.apiService.getIncidents(1, 10).subscribe({
      next: (data) => {
        this.incidents = Array.isArray(data) ? [...data] : [];
        this.page = 2;
        this.isLoading = false;

        this.cdr.detectChanges();

        event.target.complete();
      },
      error: (error) => {
        console.error('Error al actualizar incidencias:', error);

        this.hasError = true;
        this.isLoading = false;
        event.target.complete();

        this.cdr.detectChanges();
      }
    });
  }


  async ionViewWillEnter() {
    this.page = 1;
    this.incidents = [];
    this.hasError = false;
    this.isLoading = false;

    this.trackedIds = await this.storage.getTrackedIncidents();

    this.loadIncidents();
  }


  ngOnInit() { }



  loadIncidents(event?: any) {
    if (this.isLoading) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    this.apiService.getIncidents(this.page, 10).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.incidents =
            this.page === 1
              ? [...data]
              : [...this.incidents, ...data];

          this.page++;
        }

        this.isLoading = false;
        this.cdr.detectChanges();

        if (event) {
          event.target.complete();

          if (!data || data.length < 10) {
            event.target.disabled = true;
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar incidencias:', error);

        this.isLoading = false;
        this.hasError = true;
        this.cdr.detectChanges();

        if (event) {
          event.target.complete();
        }
      }
    });
  }



  async toggleTracking(incidentId: string, event: Event) {
    event.stopPropagation();
    await this.storage.toggleTracking(incidentId);
    this.trackedIds = await this.storage.getTrackedIncidents();
  }

  isTracked(id: string) {
    return this.trackedIds.includes(id);
  }

  async verDetalle(incident: Incident) {
    const modal = await this.modalCtrl.create({
      component: DetalleIncidenciaComponent,
      componentProps: { incident }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data?.updated) {
        const index = this.incidents.findIndex(i => i.id === incident.id);
        if (index > -1) this.incidents[index] = result.data.incident;
      }
    });
    await modal.present();
  }
}