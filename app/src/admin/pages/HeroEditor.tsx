import { useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';

export function HeroEditor() {
  const { content, updateHero, updateCompanyName } = useSite();
  const { hero } = content;

  const [formData, setFormData] = useState({
    companyName: content.companyName,
    title: hero.title,
    subtitle: hero.subtitle,
    backgroundImage: hero.backgroundImage,
    primaryButtonText: hero.primaryButtonText,
    secondaryButtonText: hero.secondaryButtonText,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const trimmedName = formData.companyName.trim();
    updateCompanyName(trimmedName || content.companyName);
    updateHero({
      title: formData.title,
      subtitle: formData.subtitle,
      backgroundImage: formData.backgroundImage,
      primaryButtonText: formData.primaryButtonText,
      secondaryButtonText: formData.secondaryButtonText,
    });
    toast.success('Изменения сохранены');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gray-900">
          <img
            src={formData.backgroundImage}
            alt="Hero preview"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-2xl lg:text-3xl font-light mb-2">{formData.title}</h1>
              <p className="text-white/80">{formData.subtitle}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Название компании</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Например: Interior Studio"
            />
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <Label>Фоновое изображение</Label>
            <div className="flex gap-4 items-start">
              <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.backgroundImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  value={formData.backgroundImage}
                  onChange={(e) => handleChange('backgroundImage', e.target.value)}
                  placeholder="URL изображения"
                  className="mb-2"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('hero-image')?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Загрузить
                  </Button>
                  <input
                    id="hero-image"
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
              placeholder="Введите заголовок"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Подзаголовок</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Введите подзаголовок"
            />
          </div>

          {/* Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryButton">Текст основной кнопки</Label>
              <Input
                id="primaryButton"
                value={formData.primaryButtonText}
                onChange={(e) => handleChange('primaryButtonText', e.target.value)}
                placeholder="Например: Получить консультацию"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryButton">Текст вторичной кнопки</Label>
              <Input
                id="secondaryButton"
                value={formData.secondaryButtonText}
                onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                placeholder="Например: Проекты"
              />
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
