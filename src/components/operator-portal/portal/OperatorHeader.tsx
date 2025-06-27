
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OperatorAuth } from '@/types/operator-portal';

interface OperatorHeaderProps {
  operator: OperatorAuth;
}

export default function OperatorHeader({ operator }: OperatorHeaderProps) {
  return (
    <header className="bg-gradient-green shadow-sm border-b border-green-darker/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Sistema
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black">Portal del Operador</h1>
            <p className="text-sm text-black/80">{operator.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-black">
          <User className="h-4 w-4" />
          <span className="text-sm">{operator.name}</span>
        </div>
      </div>
    </header>
  );
}
