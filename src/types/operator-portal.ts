
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
  category: 'exterior' | 'interior' | 'engine' | 'safety' | 'documentation';
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
  // Exterior
  { id: '1', name: 'Parabrisas delantero', checked: false, category: 'exterior' },
  { id: '2', name: 'Parabrisas trasero', checked: false, category: 'exterior' },
  { id: '3', name: 'Ventana lateral izquierda', checked: false, category: 'exterior' },
  { id: '4', name: 'Ventana lateral derecha', checked: false, category: 'exterior' },
  { id: '5', name: 'Faro delantero izquierdo', checked: false, category: 'exterior' },
  { id: '6', name: 'Faro delantero derecho', checked: false, category: 'exterior' },
  { id: '7', name: 'Luz trasera izquierda', checked: false, category: 'exterior' },
  { id: '8', name: 'Luz trasera derecha', checked: false, category: 'exterior' },
  { id: '9', name: 'Espejo lateral izquierdo', checked: false, category: 'exterior' },
  { id: '10', name: 'Espejo lateral derecho', checked: false, category: 'exterior' },
  { id: '11', name: 'Puerta delantera izquierda', checked: false, category: 'exterior' },
  { id: '12', name: 'Puerta delantera derecha', checked: false, category: 'exterior' },
  { id: '13', name: 'Puerta trasera izquierda', checked: false, category: 'exterior' },
  { id: '14', name: 'Puerta trasera derecha', checked: false, category: 'exterior' },
  { id: '15', name: 'Cofre/Capó', checked: false, category: 'exterior' },
  { id: '16', name: 'Cajuela/Maletero', checked: false, category: 'exterior' },
  { id: '17', name: 'Parachoques delantero', checked: false, category: 'exterior' },
  { id: '18', name: 'Parachoques trasero', checked: false, category: 'exterior' },
  { id: '19', name: 'Llanta delantera izquierda', checked: false, category: 'exterior' },
  { id: '20', name: 'Llanta delantera derecha', checked: false, category: 'exterior' },
  { id: '21', name: 'Llanta trasera izquierda', checked: false, category: 'exterior' },
  { id: '22', name: 'Llanta trasera derecha', checked: false, category: 'exterior' },
  { id: '23', name: 'Llanta de refacción', checked: false, category: 'exterior' },
  
  // Interior
  { id: '24', name: 'Asiento del conductor', checked: false, category: 'interior' },
  { id: '25', name: 'Asiento del copiloto', checked: false, category: 'interior' },
  { id: '26', name: 'Asientos traseros', checked: false, category: 'interior' },
  { id: '27', name: 'Volante', checked: false, category: 'interior' },
  { id: '28', name: 'Tablero de instrumentos', checked: false, category: 'interior' },
  { id: '29', name: 'Radio/Sistema de audio', checked: false, category: 'interior' },
  { id: '30', name: 'Aire acondicionado', checked: false, category: 'interior' },
  { id: '31', name: 'Cinturones de seguridad', checked: false, category: 'interior' },
  { id: '32', name: 'Alfombrillas', checked: false, category: 'interior' },
  { id: '33', name: 'Tapetes', checked: false, category: 'interior' },
  
  // Motor
  { id: '34', name: 'Batería', checked: false, category: 'engine' },
  { id: '35', name: 'Motor', checked: false, category: 'engine' },
  { id: '36', name: 'Radiador', checked: false, category: 'engine' },
  { id: '37', name: 'Aceite', checked: false, category: 'engine' },
  { id: '38', name: 'Líquido de frenos', checked: false, category: 'engine' },
  { id: '39', name: 'Filtros', checked: false, category: 'engine' },
  
  // Seguridad
  { id: '40', name: 'Triángulos de seguridad', checked: false, category: 'safety' },
  { id: '41', name: 'Extintor', checked: false, category: 'safety' },
  { id: '42', name: 'Botiquín', checked: false, category: 'safety' },
  { id: '43', name: 'Gato hidráulico', checked: false, category: 'safety' },
  { id: '44', name: 'Herramientas básicas', checked: false, category: 'safety' },
  
  // Documentación
  { id: '45', name: 'Tarjeta de circulación', checked: false, category: 'documentation' },
  { id: '46', name: 'Póliza de seguro', checked: false, category: 'documentation' },
  { id: '47', name: 'Licencia del conductor', checked: false, category: 'documentation' },
  { id: '48', name: 'Manual del propietario', checked: false, category: 'documentation' }
];

export const PHOTO_TYPES = [
  { id: 'front', name: 'Frontal', required: true },
  { id: 'back', name: 'Trasero', required: true },
  { id: 'left', name: 'Izquierdo', required: true },
  { id: 'right', name: 'Derecho', required: true },
  { id: 'interior', name: 'Interior', required: false },
  { id: 'engine', name: 'Motor', required: false }
] as const;
