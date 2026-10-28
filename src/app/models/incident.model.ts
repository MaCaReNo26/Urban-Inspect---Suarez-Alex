export interface Incident {
  id?: string;
  code: string;
  type: string;
  description: string;
  address: string;
  sector: string;
  date: string;
  status: 'Pendiente' | 'En Proceso' | 'Resuelta';
  priority: 'Baja' | 'Media' | 'Alta';
  photoUrl?: string; // Evidencia fotográfica
  latitude?: number;
  longitude?: number;
  observation?: string; // Obligatorio al marcar como resuelta
}

export interface WeatherInfo {
  temperature: number;
  precipitation: number;
  conditionCode: number;
}