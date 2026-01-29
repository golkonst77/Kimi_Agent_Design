import { useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Star, ImageIcon } from 'lucide-react';
import type { Testimonial } from '@/types';

export function TestimonialsManager() {
  const { content, updateTestimonials } = useSite();
  const { testimonials } = content;

  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (item: Testimonial) => {
    if (editingItem) {
      const updated = testimonials.map((t) => (t.id === item.id ? item : t));
      updateTestimonials(updated);
      toast.success('Отзыв обновлён');
    } else {
      const newItem = { ...item, id: Date.now().toString() };
      updateTestimonials([...testimonials, newItem]);
      toast.success('Отзыв добавлен');
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      updateTestimonials(updated);
      toast.success('Отзыв удалён');
    }
  };

  const openEditDialog = (item: Testimonial) => {
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
          <h3 className="text-lg font-medium">Отзывы клиентов</h3>
          <p className="text-sm text-gray-500">{testimonials.length} отзывов</p>
        </div>
        <Button onClick={openAddDialog} className="bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Добавить отзыв
        </Button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((item) => (
          <Card key={item.id} className="group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.projectType}</p>
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

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < item.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-gray-600 line-clamp-4">"{item.text}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Редактировать отзыв' : 'Добавить отзыв'}
            </DialogTitle>
          </DialogHeader>
          <TestimonialForm
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

function TestimonialForm({
  item,
  onSave,
  onCancel,
}: {
  item: Testimonial | null;
  onSave: (item: Testimonial) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Testimonial>(
    item || {
      id: '',
      name: '',
      photo: '',
      projectType: '',
      text: '',
      rating: 5,
    }
  );

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('photo', reader.result as string);
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
      {/* Photo */}
      <div className="space-y-2">
        <Label>Фото клиента</Label>
        <div className="flex gap-4 items-start">
          {formData.photo && (
            <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
              <img
                src={formData.photo}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <Input
              type="text"
              value={formData.photo}
              onChange={(e) => handleChange('photo', e.target.value)}
              placeholder="URL фото"
              className="mb-2"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('testimonial-photo')?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Загрузить
            </Button>
            <input
              id="testimonial-photo"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Имя клиента</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Например: Анна и Михаил"
          required
        />
      </div>

      {/* Project Type */}
      <div className="space-y-2">
        <Label htmlFor="projectType">Тип проекта</Label>
        <Input
          id="projectType"
          value={formData.projectType}
          onChange={(e) => handleChange('projectType', e.target.value)}
          placeholder="Например: Дизайн 3-комнатной квартиры"
          required
        />
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label>Рейтинг</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleChange('rating', star)}
              className="p-1"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= formData.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <Label htmlFor="text">Текст отзыва</Label>
        <Textarea
          id="text"
          value={formData.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Текст отзыва..."
          rows={4}
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
