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
import { Plus, Pencil, Trash2, MessageCircle, Palette, Eye, Package } from 'lucide-react';
import type { Service } from '@/types';

const iconOptions = [
  { id: 'MessageCircle', label: 'Консультация', icon: MessageCircle },
  { id: 'Palette', label: 'Дизайн', icon: Palette },
  { id: 'Eye', label: 'Надзор', icon: Eye },
  { id: 'Package', label: 'Комплектация', icon: Package },
];

export function ServicesManager() {
  const { content, updateServices } = useSite();
  const { services } = content;

  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (item: Service) => {
    if (editingItem) {
      const updated = services.map((s) => (s.id === item.id ? item : s));
      updateServices(updated);
      toast.success('Услуга обновлена');
    } else {
      const newItem = { ...item, id: Date.now().toString() };
      updateServices([...services, newItem]);
      toast.success('Услуга добавлена');
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      const updated = services.filter((s) => s.id !== id);
      updateServices(updated);
      toast.success('Услуга удалена');
    }
  };

  const openEditDialog = (item: Service) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const getIconComponent = (iconId: string) => {
    return iconOptions.find((i) => i.id === iconId)?.icon || Palette;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Услуги</h3>
          <p className="text-sm text-gray-500">{services.length} услуг</p>
        </div>
        <Button onClick={openAddDialog} className="bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Добавить услугу
        </Button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((item) => {
          const Icon = getIconComponent(item.icon);
          return (
            <Card key={item.id} className="group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-gray-900 font-medium mt-2">{item.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Редактировать услугу' : 'Добавить услугу'}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
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

function ServiceForm({
  item,
  onSave,
  onCancel,
}: {
  item: Service | null;
  onSave: (item: Service) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Service>(
    item || {
      id: '',
      title: '',
      description: '',
      price: '',
      icon: 'Palette',
    }
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Название услуги"
          required
        />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label>Иконка</Label>
        <Select
          value={formData.icon}
          onValueChange={(value) => handleChange('icon', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((icon) => (
              <SelectItem key={icon.id} value={icon.id}>
                <span className="flex items-center gap-2">
                  <icon.icon className="w-4 h-4" />
                  {icon.label}
                </span>
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
          placeholder="Описание услуги"
          rows={3}
          required
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="Например: от 5 000 ₽"
          required
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
