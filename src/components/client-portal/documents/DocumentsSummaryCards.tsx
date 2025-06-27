
import { Card, CardContent } from '@/components/ui/card';
import { FileText, File, Award } from 'lucide-react';
import type { ClientDocument } from '@/types/client-portal';

interface DocumentsSummaryCardsProps {
  documents: ClientDocument[];
}

export default function DocumentsSummaryCards({ documents }: DocumentsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Facturas</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(d => d.type === 'invoice').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <File className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Reportes</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(d => d.type === 'report').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreforeground">Certificados</p>
              <p className="text-2xl font-bold text-foreground">
                {documents.filter(d => d.type === 'certificate').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
