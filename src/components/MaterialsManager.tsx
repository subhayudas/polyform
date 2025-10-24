import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  type: string;
  cost_per_gram: number;
  density: number;
  setup_cost: number;
  complexity_multiplier: number;
  color_options: string[];
  properties: any;
  is_active: boolean;
}

const MaterialsManager: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getMaterials } = useOrders();

  const [formData, setFormData] = useState({
    name: '',
    type: 'plastic',
    cost_per_gram: 0,
    density: 0,
    setup_cost: 0,
    complexity_multiplier: 1.0,
    color_options: [] as string[],
    properties: {},
    is_active: true
  });

  const [newColor, setNewColor] = useState('');

  const materialTypes = [
    { value: 'plastic', label: 'Plastic' },
    { value: 'metal', label: 'Metal' },
    { value: 'composite', label: 'Composite' },
    { value: 'specialty', label: 'Specialty' }
  ];

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch materials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (editingMaterial) {
        // Update existing material
        const { error } = await supabase
          .from('materials')
          .update(formData)
          .eq('id', editingMaterial.id);

        if (error) throw error;

        toast({
          title: "Material Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Create new material
        const { error } = await supabase
          .from('materials')
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Material Created",
          description: `${formData.name} has been created successfully.`,
        });
      }

      setIsDialogOpen(false);
      setEditingMaterial(null);
      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        title: "Error",
        description: "Failed to save material",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'plastic',
      cost_per_gram: 0,
      density: 0,
      setup_cost: 0,
      complexity_multiplier: 1.0,
      color_options: [],
      properties: {},
      is_active: true
    });
    setNewColor('');
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      type: material.type,
      cost_per_gram: material.cost_per_gram,
      density: material.density,
      setup_cost: material.setup_cost,
      complexity_multiplier: material.complexity_multiplier,
      color_options: material.color_options,
      properties: material.properties,
      is_active: material.is_active
    });
    setIsDialogOpen(true);
  };

  const handleAddColor = () => {
    if (newColor.trim() && !formData.color_options.includes(newColor.trim())) {
      setFormData({
        ...formData,
        color_options: [...formData.color_options, newColor.trim()]
      });
      setNewColor('');
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData({
      ...formData,
      color_options: formData.color_options.filter(c => c !== color)
    });
  };

  const handleDelete = async (material: Material) => {
    if (!confirm(`Are you sure you want to delete ${material.name}?`)) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id);

      if (error) throw error;

      toast({
        title: "Material Deleted",
        description: `${material.name} has been deleted.`,
      });

      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-polyform-green-600"></div>
            <span className="ml-2">Loading materials...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Materials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-polyform-green-600 hover:bg-polyform-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? 'Edit Material' : 'Add New Material'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Material Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cost_per_gram">Cost per Gram ($)</Label>
                  <Input
                    id="cost_per_gram"
                    type="number"
                    step="0.0001"
                    value={formData.cost_per_gram}
                    onChange={(e) => setFormData({ ...formData, cost_per_gram: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="density">Density (g/cm³)</Label>
                  <Input
                    id="density"
                    type="number"
                    step="0.001"
                    value={formData.density}
                    onChange={(e) => setFormData({ ...formData, density: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="setup_cost">Setup Cost ($)</Label>
                  <Input
                    id="setup_cost"
                    type="number"
                    step="0.01"
                    value={formData.setup_cost}
                    onChange={(e) => setFormData({ ...formData, setup_cost: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="complexity_multiplier">Complexity Multiplier</Label>
                <Input
                  id="complexity_multiplier"
                  type="number"
                  step="0.1"
                  value={formData.complexity_multiplier}
                  onChange={(e) => setFormData({ ...formData, complexity_multiplier: parseFloat(e.target.value) || 1.0 })}
                  required
                />
              </div>

              <div>
                <Label>Color Options</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color option"
                  />
                  <Button type="button" onClick={handleAddColor} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.color_options.map((color, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingMaterial ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-polyform-green-600" />
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(material)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(material)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{material.type}</Badge>
                <Badge variant={material.is_active ? "default" : "secondary"}>
                  {material.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cost per gram:</span>
                  <span>${material.cost_per_gram.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Density:</span>
                  <span>{material.density} g/cm³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Setup cost:</span>
                  <span>${material.setup_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Complexity:</span>
                  <span>{material.complexity_multiplier}x</span>
                </div>
                {material.color_options.length > 0 && (
                  <div>
                    <span className="text-gray-500">Colors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {material.color_options.slice(0, 3).map((color, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                      {material.color_options.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{material.color_options.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaterialsManager;
