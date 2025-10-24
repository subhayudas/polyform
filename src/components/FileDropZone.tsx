
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, X } from 'lucide-react';

interface FileDropZoneProps {
  selectedFile: File | null;
  isDragOver: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onRemoveFile: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  selectedFile,
  isDragOver,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemoveFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedFile) {
    return (
      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="h-10 w-10 text-polyform-green-600" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver
          ? 'border-polyform-green-500 bg-polyform-green-50'
          : 'border-gray-300 hover:border-polyform-green-400'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <p className="text-xl font-medium text-gray-900 mb-2">
        Drop your files here or click to browse
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Supports: STL, OBJ, 3MF, STEP, IGES, PDF, DOC, DOCX<br />
        Max size: 100MB for 3D files, 10MB for documents
      </p>
      
      <Button 
        variant="outline" 
        className="border-polyform-green-600 text-polyform-green-600 hover:bg-polyform-green-50"
        onClick={handleBrowseClick}
      >
        Browse Files
      </Button>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf,.step,.stp,.iges,.igs,.pdf,.doc,.docx"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileDropZone;
