
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface DocumentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function DocumentsFilters({ searchTerm, onSearchChange }: DocumentsFiltersProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
          </div>
          <Button variant="outline" className="border-border">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
