
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';
import CreateInvoiceForm from '@/components/invoices/CreateInvoiceForm';
import type { Invoice, CreateInvoiceData } from '@/types/invoices';

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      folio: 'FAC-20241220-001',
      closure_id: '1',
      closure_folio: 'CIE-20241220-001',
      client_id: '1',
      client_name: 'Constructora ABC',
      issue_date: '2024-12-20',
      due_date: '2025-01-20',
      subtotal: 750000,
      tax_rate: 16,
      tax_amount: 120000,
      total_amount: 870000,
      status: 'sent',
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-20T10:00:00Z'
    },
    {
      id: '2',
      folio: 'FAC-20241218-002',
      closure_id: '3',
      closure_folio: 'CIE-20241215-003',
      client_id: '3',
      client_name: 'Transportes Norte',
      issue_date: '2024-12-18',
      due_date: '2025-01-18',
      subtotal: 1200000,
      tax_rate: 16,
      tax_amount: 192000,
      total_amount: 1392000,
      status: 'paid',
      payment_date: '2024-12-25',
      created_at: '2024-12-18T14:30:00Z',
      updated_at: '2024-12-25T09:15:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'sent': return 'Enviada';
      case 'draft': return 'Borrador';
      case 'overdue': return 'Vencida';
      case 'cancelled': return 'Anulada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <Trash2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCreateInvoice = (data: CreateInvoiceData) => {
    console.log('Creating invoice:', data);
    toast({
      title: "Factura creada",
      description: "La factura ha sido creada exitosamente.",
    });
    setShowCreateForm(false);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalInvoices = invoices.length;
  const pendingAmount = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.total_amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total_amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0);

  const statusFilters = [
    { value: 'all', label: 'Todas' },
    { value: 'draft', label: 'Borrador' },
    { value: 'sent', label: 'Enviada' },
    { value: 'paid', label: 'Pagada' },
    { value: 'overdue', label: 'Vencida' },
    { value: 'cancelled', label: 'Anulada' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Facturas</h1>
          <p className="text-muted-foreground mt-1">Gestión de facturación y pagos</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Facturas</p>
                <p className="text-2xl font-bold text-foreground">{totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">${pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Vencidas</p>
                <p className="text-2xl font-bold text-foreground">${overdueAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Cobradas</p>
                <p className="text-2xl font-bold text-primary">${paidAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por folio o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                  className={statusFilter === filter.value ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border-border"}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Grid */}
      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg text-foreground">{invoice.folio}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(invoice.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(invoice.status)}
                      <span>{getStatusText(invoice.status)}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground">{invoice.client_name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  Cierre: {invoice.closure_folio}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Emitida: {new Date(invoice.issue_date).toLocaleDateString('es-ES')}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Vence: {new Date(invoice.due_date).toLocaleDateString('es-ES')}
                </div>
                {invoice.payment_date && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pagada: {new Date(invoice.payment_date).toLocaleDateString('es-ES')}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground">Subtotal: ${invoice.subtotal.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">IVA: ${invoice.tax_amount.toLocaleString()}</p>
                    <p className="font-bold text-primary text-lg">
                      ${invoice.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-border">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-border">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-border">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-medium text-foreground mb-2">No hay facturas</h3>
            <p className="text-muted-foreground">
              No se encontraron facturas que coincidan con los filtros aplicados
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredInvoices.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" className="border-border">Anterior</Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">1</Button>
          <Button variant="outline" size="sm" className="border-border">2</Button>
          <Button variant="outline" size="sm" className="border-border">3</Button>
          <Button variant="outline" size="sm" className="border-border">Siguiente</Button>
        </div>
      )}

      {/* Create Invoice Form Modal */}
      {showCreateForm && (
        <CreateInvoiceForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateInvoice}
        />
      )}
    </div>
  );
}
