
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle } from 'lucide-react';

interface SignatureCanvasProps {
  title: string;
  subtitle: string;
  hasSignature: boolean;
  onSignatureComplete: (dataURL: string) => void;
  onClear: () => void;
}

export default function SignatureCanvas({ 
  title, 
  subtitle, 
  hasSignature, 
  onSignatureComplete, 
  onClear 
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawingRef.current = true;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      onSignatureComplete(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onClear();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        {hasSignature && <CheckCircle className="h-5 w-5 text-green-600" />}
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className={`w-full h-32 border rounded cursor-crosshair bg-white ${
            hasSignature ? 'border-green-300' : 'border-gray-300'
          }`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={() => isDrawingRef.current = false}
        />
        <p className="text-xs text-center text-muted-foreground mt-2">
          Firma aquí usando el mouse o tu dedo
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={clearSignature}
          className="flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Limpiar Firma</span>
        </Button>
      </div>
    </div>
  );
}
