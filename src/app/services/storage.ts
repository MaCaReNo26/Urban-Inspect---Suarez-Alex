import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {
  // R1: Conservar localmente la lista de códigos marcados
  async getTrackedIncidents(): Promise<string[]> {
    const { value } = await Preferences.get({ key: 'tracked_incidents' });
    return value ? JSON.parse(value) : [];
  }

  async toggleTracking(incidentId: string): Promise<boolean> {
    const tracked = await this.getTrackedIncidents();
    const index = tracked.indexOf(incidentId);
    let isTracked = false;
    
    if (index > -1) {
      tracked.splice(index, 1); // Desmarcar
    } else {
      tracked.push(incidentId); // Marcar
      isTracked = true;
    }
    
    await Preferences.set({ key: 'tracked_incidents', value: JSON.stringify(tracked) });
    return isTracked;
  }

  // R8: Conservar campos del formulario incompleto
  async saveDraftForm(formData: any) {
    await Preferences.set({ key: 'draft_incident', value: JSON.stringify(formData) });
  }

  async getDraftForm(): Promise<any> {
    const { value } = await Preferences.get({ key: 'draft_incident' });
    return value ? JSON.parse(value) : null;
  }

  async clearDraftForm() {
    await Preferences.remove({ key: 'draft_incident' });
  }
}