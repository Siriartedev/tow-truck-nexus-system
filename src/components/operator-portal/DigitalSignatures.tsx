
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PenTool, Trash2, CheckCircle } from 'lucide-react';
import { ServiceInspection } from '@/types/operator-portal';
import { toast } from 'sonner';

interface DigitalSignaturesProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
  onPrevious: () => void;
  operatorName: string;
}

export default function DigitalSignatures({ 
  inspection, 
  onUpdate, 
  onPrevious, 
  operatorName 
}: DigitalSignaturesProps) {
  const operatorCanvasRef = useRef<HTMLCanvasElement>(null);
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingOperator, setIsDrawingOperator] = useState(false);
  const [isDrawingClient, setIsDrawingClient] = useState(false);

  useEffect(() => {
    // Configurar canvas
    const setupCanvas = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    if (operatorCanvasRef.current) setupCanvas(operatorCanvasRef.current);
    if (clientCanvasRef.current) setupCanvas(clientCanvasRef.current);
  }, []);

  const startDrawing = (e: React.MouseEvent, canvas: HTMLCanvasElement, setDrawing: (drawing: boolean) => void) => {
    setDrawing(true);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent, canvas: HTMLCanvasElement, isDrawing: boolean) => {
    if (!isDrawing) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = (canvas: HTMLCanvasElement, setDrawing: (drawing: boolean) => void, signatureType: 'operator' | 'client') => {
    setDrawing(false);
    const dataURL = canvas.toDataURL();
    
    onUpdate({
      ...inspection,
      signatures: {
        ...inspection.signatures,
        [signatureType]: dataURL
      }
    });
  };

  const clearSignature = (canvas: HTMLCanvasElement, signatureType: 'operator' | 'client') => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onUpdate({
        ...inspection,
        signatures: {
          ...inspection.signatures,
          [signatureType]: null
        }
      });
    }
  };

  const hasOperatorSignature = inspection.signatures.operator;
  const hasClientSignature = inspection.signatures.client;
  const allSignaturesComplete = hasOperatorSignature && hasClientSignature;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PenTool className="h-5 w-5 text-purple-600" />
            <span>Firmas Digitales</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tanto el operador como el cliente deben firmar para completar la inspección.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Firmas completadas: {(hasOperatorSignature ? 1 : 0) + (hasClientSignature ? 1 : 0)} de 2
            </div>
            <div className="flex items-center space-x-2">
              {allSignaturesComplete ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Listo para completar</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Faltan firmas</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operator Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Firma del Operador</span>
            {hasOperatorSignature && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {operatorName} - Confirma que la inspección fue realizada correctamente
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <canvas
              ref={operatorCanvasRef}
              width={400}
              height={200}
              className={`w-full h-32 border rounded cursor-crosshair bg-white ${
                hasOperatorSignature ? 'border-green-300' : 'border-gray-300'
              }`}
              onMouseDown={(e) => startDrawing(e, operatorCanvasRef.current!, setIsDrawingOperator)}
              onMouseMove={(e) => draw(e, operatorCanvasRef.current!, isDrawingOperator)}
              onMouseUp={() => stopDrawing(operatorCanvasRef.current!, setIsDrawingOperator, 'operator')}
              onMouseLeave={() => setIsDrawingOperator(false)}
            />
            <p className="text-xs text-center text-muted-foreground mt-2">
              Firma aquí usando el mouse o tu dedo
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearSignature(operatorCanvasRef.current!, 'operator')}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpiar Firma</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Firma del Cliente</span>
            {hasClientSignature && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Cliente - Confirma que acepta el estado del vehículo documentado
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <canvas
              ref={clientCanvasRef}
              width={400}
              height={200}
              className={`w-full h-32 border rounded cursor-crosshair bg-white ${
                hasClientSignature ? 'border-green-300' : 'border-gray-300'
              }`}
              onMouseDown={(e) => startDrawing(e, clientCanvasRef.current!, setIsDrawingClient)}
              onMouseMove={(e) => draw(e, clientCanvasRef.current!, isDrawingClient)}
              onMouseUp={() => stopDrawing(clientCanvasRef.current!, setIsDrawingClient, 'client')}
              onMouseLeave={() => setIsDrawingClient(false)}
            />
            <p className="text-xs text-center text-muted-foreground mt-2">
              El cliente debe firmar aquí
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearSignature(clientCanvasRef.current!, 'client')}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpiar Firma</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline" size="lg" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Fotografías</span>
        </Button>
        
        <div className="text-center">
          {allSignaturesComplete ? (
            <p className="text-sm text-green-600 font-medium">
              ✓ Todas las firmas completadas. Usa el botón "Completar Inspección" para finalizar.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Completa ambas firmas para poder finalizar la inspección
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
