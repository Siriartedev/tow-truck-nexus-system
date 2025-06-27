
export interface OperatorAuth {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  checked: boolean;
  category: 'interior' | 'motor' | 'exterior' | 'seguridad' | 'herramientas' | 'otros';
}

export interface ServicePhoto {
  id: string;
  type: 'front' | 'back' | 'left' | 'right' | 'interior' | 'engine';
  file: File | null;
  url?: string;
  timestamp: string;
}

export interface DigitalSignature {
  operator: string | null;
  client: string | null;
}

export interface ServiceInspection {
  id: string;
  service_id: string;
  operator_id: string;
  inspection_items: InspectionItem[];
  photos: ServicePhoto[];
  observations: string;
  client_present_name?: string;
  signatures: DigitalSignature;
  completed_at?: string;
  created_at: string;
}

export const DEFAULT_INSPECTION_ITEMS: InspectionItem[] = [
  // Interior
  { id: '1', name: 'Espejo Interno', checked: false, category: 'interior' },
  { id: '2', name: 'Radio', checked: false, category: 'interior' },
  { id: '3', name: 'Cint. Seguridad', checked: false, category: 'interior' },
  { id: '4', name: 'Tapa Bencina', checked: false, category: 'interior' },
  { id: '5', name: 'TAG', checked: false, category: 'interior' },
  { id: '6', name: 'Cuñas', checked: false, category: 'interior' },
  { id: '7', name: 'Consola', checked: false, category: 'interior' },
  
  // Motor y Mecánica
  { id: '8', name: 'Piso Goma', checked: false, category: 'motor' },
  { id: '9', name: 'Rueda Del.Der.', checked: false, category: 'motor' },
  { id: '10', name: 'Sombrilla', checked: false, category: 'motor' },
  { id: '11', name: 'Rueda Tra.Izq.', checked: false, category: 'motor' },
  { id: '12', name: 'Encendedor', checked: false, category: 'motor' },
  { id: '13', name: 'Rueda Tra.Der.', checked: false, category: 'motor' },
  { id: '14', name: 'Tapa Ruedas', checked: false, category: 'motor' },
  { id: '15', name: 'Batería', checked: false, category: 'motor' },
  { id: '16', name: 'Parlantes', checked: false, category: 'motor' },
  { id: '17', name: 'Tapa Radiador', checked: false, category: 'motor' },
  { id: '18', name: 'Cenicero', checked: false, category: 'motor' },
  { id: '19', name: 'Triángulos', checked: false, category: 'motor' },
  { id: '20', name: 'Gata', checked: false, category: 'motor' },
  { id: '21', name: 'Emblemas', checked: false, category: 'motor' },
  { id: '22', name: 'Rueda Rpto.', checked: false, category: 'motor' },
  { id: '23', name: 'Chaleco Reflectante', checked: false, category: 'motor' },
  { id: '24', name: 'Baliza', checked: false, category: 'motor' },
  
  // Exterior
  { id: '25', name: 'Espejo Exterior', checked: false, category: 'exterior' },
  { id: '26', name: 'Extintor', checked: false, category: 'exterior' },
  { id: '27', name: 'Limp. Parab.', checked: false, category: 'exterior' },
  { id: '28', name: 'Botiquín', checked: false, category: 'exterior' },
  { id: '29', name: 'Neblineros', checked: false, category: 'exterior' },
  { id: '30', name: 'Llave Rueda', checked: false, category: 'exterior' },
  { id: '31', name: 'Antena', checked: false, category: 'exterior' },
  { id: '32', name: 'Caja Invierno', checked: false, category: 'exterior' },
  { id: '33', name: 'Rueda Del Izq.', checked: false, category: 'exterior' },
  { id: '34', name: 'Pertiga', checked: false, category: 'exterior' },
  { id: '35', name: 'Extintor 10 K.', checked: false, category: 'exterior' }
];

export const PHOTO_TYPES = [
  { id: 'front', name: 'Frontal', required: true },
  { id: 'back', name: 'Trasero', required: true },
  { id: 'left', name: 'Izquierdo', required: true },
  { id: 'right', name: 'Derecho', required: true },
  { id: 'interior', name: 'Interior', required: false },
  { id: 'engine', name: 'Motor', required: false }
] as const;
