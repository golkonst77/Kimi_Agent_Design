import { useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Instagram, Send, MessageCircle } from 'lucide-react';

export function ContactsEditor() {
  const { content, updateContacts } = useSite();
  const { contacts } = content;

  const [formData, setFormData] = useState({
    phone: contacts.phone,
    email: contacts.email,
    address: contacts.address,
    socialLinks: { ...contacts.socialLinks },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleSave = () => {
    updateContacts(formData);
    toast.success('Контакты обновлены');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Телефон
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="hello@example.com"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Адрес
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Москва, ул. Примерная, 1"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label>Социальные сети</Label>
            
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm text-gray-500 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={formData.socialLinks.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram" className="text-sm text-gray-500 flex items-center gap-2">
                <Send className="w-4 h-4" />
                Telegram
              </Label>
              <Input
                id="telegram"
                value={formData.socialLinks.telegram || ''}
                onChange={(e) => handleSocialChange('telegram', e.target.value)}
                placeholder="https://t.me/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm text-gray-500 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                value={formData.socialLinks.whatsapp || ''}
                onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                placeholder="https://wa.me/79991234567"
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

      {/* Preview */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Предпросмотр</h4>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Телефон</div>
                <div className="text-gray-900">{formData.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-gray-900">{formData.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Адрес</div>
                <div className="text-gray-900">{formData.address}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
