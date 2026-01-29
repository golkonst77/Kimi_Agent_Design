import { useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';

export function AboutEditor() {
  const { content, updateAbout } = useSite();
  const { about } = content;

  const [formData, setFormData] = useState({
    title: about.title,
    description: about.description,
    image: about.image,
    stats: { ...about.stats },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: { ...prev.stats, [field]: parseInt(value) || 0 },
    }));
  };

  const handleSave = () => {
    updateAbout(formData);
    toast.success('Изменения сохранены');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Файл слишком большой. Используйте изображение до 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <Label>Фото дизайнера</Label>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.image}
                  alt="Designer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="URL изображения"
                  className="mb-2"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('about-image')?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Загрузить
                  </Button>
                  <input
                    id="about-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Например: Обо мне"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Расскажите о себе..."
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Используйте двойной перенос строки для разделения абзацев
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Label>Статистика</Label>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years" className="text-sm text-gray-500">
                  Лет опыта
                </Label>
                <Input
                  id="years"
                  type="number"
                  value={formData.stats.years}
                  onChange={(e) => handleStatChange('years', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projects" className="text-sm text-gray-500">
                  Количество проектов
                </Label>
                <Input
                  id="projects"
                  type="number"
                  value={formData.stats.projects}
                  onChange={(e) => handleStatChange('projects', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="satisfaction" className="text-sm text-gray-500">
                  Процент довольных клиентов
                </Label>
                <Input
                  id="satisfaction"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.stats.satisfaction}
                  onChange={(e) => handleStatChange('satisfaction', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
              Сохранить изменения
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
