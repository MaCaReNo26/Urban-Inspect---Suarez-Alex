
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonIcon, IonBadge, IonThumbnail
} from '@ionic/angular';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { Incident } from '../models/incident.model';
import { addIcons } from 'ionicons';
import { bookmark } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonBadge, IonThumbnail
  ]
})
export class Tab3Page {
  trackedIncidents: Incident[] = [];

  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ bookmark });
  }

  async ionViewWillEnter() {
    await this.loadTracked();
  }

  async loadTracked() {
    try {
      const trackedIds = await this.storage.getTrackedIncidents();

      console.log('IDs guardados para seguimiento:', trackedIds);

      if (!trackedIds || trackedIds.length === 0) {
        this.trackedIncidents = [];
        this.cdr.detectChanges();
        return;
      }

      this.apiService.getIncidents(1, 100).subscribe({
        next: (allIncidents) => {
          console.log('Incidencias recibidas en seguimiento:', allIncidents);

          this.trackedIncidents = allIncidents.filter(inc =>
            trackedIds.some(id => String(id) === String(inc.id))
          );

          console.log('Incidencias encontradas:', this.trackedIncidents);

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar seguimiento:', error);
          this.trackedIncidents = [];
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      console.error('Error al recuperar los IDs guardados:', error);
      this.trackedIncidents = [];
      this.cdr.detectChanges();
    }
  }

  async desmarcar(incidentId: string) {
    await this.storage.toggleTracking(incidentId);
    await this.loadTracked();
  }
}
