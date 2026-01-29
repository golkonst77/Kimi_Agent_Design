import { useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import type { PortfolioItem } from '@/types';

const categories = [
  { id: 'apartments', label: 'Квартира' },
  { id: 'houses', label: 'Дом' },
  { id: 'commercial', label: 'Коммерческий' },
];

export function PortfolioManager() {
  const { content, updatePortfolio } = useSite();
  const { portfolio } = content;

  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (item: PortfolioItem) => {
    if (editingItem) {
      // Update existing
      const updated = portfolio.map((p) => (p.id === item.id ? item : p));
      updatePortfolio(updated);
      toast.success('Проект обновлён');
    } else {
      // Add new
      const newItem = { ...item, id: Date.now().toString() };
      updatePortfolio([...portfolio, newItem]);
      toast.success('Проект добавлен');
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      const updated = portfolio.filter((p) => p.id !== id);
      updatePortfolio(updated);
      toast.success('Проект удалён');
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Проекты портфолио</h3>
          <p className="text-sm text-gray-500">{portfolio.length} проектов</p>
        </div>
        <Button onClick={openAddDialog} className="bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Добавить проект
        </Button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolio.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="aspect-[4/3] relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="text-xs text-gray-500 mb-1">
                {categories.find((c) => c.id === item.category)?.label}
              </div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Редактировать проект' : 'Добавить проект'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectForm({
  item,
  onSave,
  onCancel,
}: {
  item: PortfolioItem | null;
  onSave: (item: PortfolioItem) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<PortfolioItem>(
    item || {
      id: '',
      title: '',
      category: 'apartments',
      image: '',
      description: '',
    }
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image */}
      <div className="space-y-2">
        <Label>Изображение</Label>
        <div className="flex gap-4 items-start">
          {formData.image && (
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <Input
              type="text"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="URL изображения"
              className="mb-2"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('project-image')?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Загрузить
            </Button>
            <input
              id="project-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Название проекта"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Категория</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Краткое описание проекта"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
          {item ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
}
