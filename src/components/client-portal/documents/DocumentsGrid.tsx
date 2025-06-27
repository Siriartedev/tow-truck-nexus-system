
import DocumentCard from './DocumentCard';
import type { ClientDocument } from '@/types/client-portal';

interface DocumentsGridProps {
  documents: ClientDocument[];
  onViewDownload: (document: ClientDocument) => void;
}

export default function DocumentsGrid({ documents, onViewDownload }: DocumentsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onViewDownload={onViewDownload}
        />
      ))}
    </div>
  );
}
