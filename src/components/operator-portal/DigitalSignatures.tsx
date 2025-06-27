
import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, RotateCcw, Check } from 'lucide-react';
import { ServiceInspection } from '@/types/operator-portal';
import { toast } from 'sonner';

interface DigitalSignaturesProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
  operatorName: string;
}

export default function DigitalSignatures({ inspection, onUpdate, operatorName }: DigitalSignaturesProps) {
  const operatorCanvasRef = useRef<HTMLCanvasElement>(null);
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeCanvas, setActiveCanvas] = useState<'operator' | 'client' | null>(null);

  useEffect(() => {
    // Configurar canvas al montar
    setupCanvas(operatorCanvasRef.current);
    setupCanvas(clientCanvasRef.current);
  }, []);

  const setupCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar estilos de dibujo
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasType: 'operator' | 'client'
  ) => {
    const canvas = canvasType === 'operator' ? operatorCanvasRef.current : clientCanvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    setActiveCanvas(canvasType);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasType: 'operator' | 'client'
  ) => {
    if (!isDrawing || activeCanvas !== canvasType) return;

    const canvas = canvasType === 'operator' ? operatorCanvasRef.current : clientCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setActiveCanvas(null);
  };

  const clearSignature = (canvasType: 'operator' | 'client') => {
    const canvas = canvasType === 'operator' ? operatorCanvasRef.current : clientCanvasRef.current;
    if (!canvas) return;

    setupCanvas(canvas);

    // Actualizar estado
    const updatedSignatures = {
      ...inspection.signatures,
      [canvasType]: null
    };

    onUpdate({
      ...inspection,
      signatures: updatedSignatures
    });

    toast.success(`Firma del ${canvasType === 'operator' ? 'operador' : 'cliente'} borrada`);
  };

  const saveSignature = (canvasType: 'operator' | 'client') => {
    const canvas = canvasType === 'operator' ? operatorCanvasRef.current : clientCanvasRef.current;
    if (!canvas) return;

    // Verificar que haya contenido en el canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let hasDrawing = false;

    // Verificar si hay píxeles no blancos
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        hasDrawing = true;
        break;
      }
    }

    if (!hasDrawing) {
      toast.error('Por favor dibuja una firma antes de guardar');
      return;
    }

    // Convertir a base64
    const signatureData = canvas.toDataURL('image/png');

    // Actualizar estado
    const updatedSignatures = {
      ...inspection.signatures,
      [canvasType]: signatureData
    };

    onUpdate({
      ...inspection,
      signatures: updatedSignatures
    });

    toast.success(`Firma del ${canvasType === 'operator' ? 'operador' : 'cliente'} guardada`);
  };

  const hasOperatorSignature = !!inspection.signatures.operator;
  const hasClientSignature = !!inspection.signatures.client;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PenTool className="h-5 w-5 text-purple-600" />
            <span>Firmas Digitales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${hasOperatorSignature ? 'text-green-600' : 'text-gray-500'}`}>
              <Check className={`h-4 w-4 ${hasOperatorSignature ? 'text-green-600' : 'text-gray-400'}`} />
              <span>Firma del Operador</span>
            </div>
            <div className={`flex items-center space-x-2 ${hasClientSignature ? 'text-green-600' : 'text-gray-500'}`}>
              <Check className={`h-4 w-4 ${hasClientSignature ? 'text-green-600' : 'text-gray-400'}`} />
              <span>Firma del Cliente</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operator Signature */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Firma del Operador</CardTitle>
            <div className="text-sm text-muted-foreground">{operatorName}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
            <canvas
              ref={operatorCanvasRef}
              width={400}
              height={200}
              className="w-full border border-gray-200 rounded cursor-crosshair touch-none"
              onMouseDown={(e) => startDrawing(e, 'operator')}
              onMouseMove={(e) => draw(e, 'operator')}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault();
                startDrawing(e, 'operator');
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(e, 'operator');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopDrawing();
              }}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => clearSignature('operator')}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button
              onClick={() => saveSignature('operator')}
              disabled={hasOperatorSignature}
            >
              <Check className="h-4 w-4 mr-2" />
              {hasOperatorSignature ? 'Firma Guardada' : 'Guardar Firma'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Signature */}
      <Card>
        <CardHeader>
          <CardTitle>Firma del Cliente</CardTitle>
          <p className="text-sm text-muted-foreground">
            El cliente debe firmar para confirmar el estado del vehículo antes del servicio
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
            <canvas
              ref={clientCanvasRef}
              width={400}
              height={200}
              className="w-full border border-gray-200 rounded cursor-crosshair touch-none"
              onMouseDown={(e) => startDrawing(e, 'client')}
              onMouseMove={(e) => draw(e, 'client')}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault();
                startDrawing(e, 'client');
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(e, 'client');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopDrawing();
              }}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => clearSignature('client')}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button
              onClick={() => saveSignature('client')}
              disabled={hasClientSignature}
            >
              <Check className="h-4 w-4 mr-2" />
              {hasClientSignature ? 'Firma Guardada' : 'Guardar Firma'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-blue-800">
            <p className="font-medium">Instrucciones para las firmas:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Usa el dedo o stylus para firmar en los recuadros</li>
              <li>Puedes limpiar y volver a firmar si es necesario</li>
              <li>Guarda cada firma antes de continuar</li>
              <li>Ambas firmas son requeridas para completar la inspección</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
