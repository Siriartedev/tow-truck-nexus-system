
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PenTool, CheckCircle } from 'lucide-react';
import { ServiceInspection } from '@/types/operator-portal';
import SignatureCanvas from './signatures/SignatureCanvas';

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
  const hasOperatorSignature = inspection.signatures.operator;
  const hasClientSignature = inspection.signatures.client;
  const allSignaturesComplete = hasOperatorSignature && hasClientSignature;

  const handleOperatorSignature = (dataURL: string) => {
    onUpdate({
      ...inspection,
      signatures: {
        ...inspection.signatures,
        operator: dataURL
      }
    });
  };

  const handleClientSignature = (dataURL: string) => {
    onUpdate({
      ...inspection,
      signatures: {
        ...inspection.signatures,
        client: dataURL
      }
    });
  };

  const clearOperatorSignature = () => {
    onUpdate({
      ...inspection,
      signatures: {
        ...inspection.signatures,
        operator: null
      }
    });
  };

  const clearClientSignature = () => {
    onUpdate({
      ...inspection,
      signatures: {
        ...inspection.signatures,
        client: null
      }
    });
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Firma del Operador</CardTitle>
        </CardHeader>
        <CardContent>
          <SignatureCanvas
            title="Firma del Operador"
            subtitle={`${operatorName} - Confirma que la inspección fue realizada correctamente`}
            hasSignature={!!hasOperatorSignature}
            onSignatureComplete={handleOperatorSignature}
            onClear={clearOperatorSignature}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Firma del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <SignatureCanvas
            title="Firma del Cliente"
            subtitle="Cliente - Confirma que acepta el estado del vehículo documentado"
            hasSignature={!!hasClientSignature}
            onSignatureComplete={handleClientSignature}
            onClear={clearClientSignature}
          />
        </CardContent>
      </Card>

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
