import { useState } from 'react';
import { useProjects } from '@/contexts/ProjectsContext';
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
import { Plus, Pencil, Trash2, ImageIcon, Eye, X, FolderOpen } from 'lucide-react';
import type { Project } from '@/types';

const categories = [
  { id: 'apartments', label: 'Квартира' },
  { id: 'houses', label: 'Дом' },
  { id: 'commercial', label: 'Коммерческий' },
];

export function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSaveProject = (project: Partial<Project>, isNew: boolean) => {
    if (isNew) {
      addProject(project as Omit<Project, 'id' | 'createdAt'>);
      toast.success('Проект создан');
    } else if (editingProject) {
      updateProject(editingProject.id, project);
      toast.success('Проект обновлён');
    }
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот проект? Все фотографии будут удалены.')) {
      deleteProject(id);
      toast.success('Проект удалён');
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const openGalleryDialog = (project: Project) => {
    setSelectedProject(project);
    setIsGalleryDialogOpen(true);
  };

  const viewProject = (projectId: string) => {
    window.open(`/#/project/${projectId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Проекты с галереями</h3>
          <p className="text-sm text-gray-500">{projects.length} проектов</p>
        </div>
        <Button onClick={openAddDialog} className="bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Создать проект
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="group overflow-hidden">
            <div className="aspect-[4/3] relative">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => viewProject(project.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditDialog(project)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {project.images.length} фото
              </div>
            </div>
            <CardContent className="p-4">
              <div className="text-xs text-gray-500 mb-1">
                {categories.find((c) => c.id === project.category)?.label}
                {project.area && ` • ${project.area}`}
                {project.year && ` • ${project.year}`}
              </div>
              <h4 className="font-medium line-clamp-1">{project.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {project.description}
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openGalleryDialog(project)}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Галерея
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => viewProject(project.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Просмотр
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Редактировать проект' : 'Создать проект'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingProject(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Gallery Manager Dialog */}
      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Управление галереей</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <GalleryManager
              project={selectedProject}
              onClose={() => setIsGalleryDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Project Form Component
function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (data: Partial<Project>, isNew: boolean) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Project>>(
    project || {
      title: '',
      category: 'apartments',
      coverImage: '',
      description: '',
      images: [],
      area: '',
      location: '',
      year: new Date().getFullYear().toString(),
    }
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const readers = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      if (isCover) {
        handleChange('coverImage', images[0]);
      } else {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...images],
        }));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, !project);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image */}
      <div className="space-y-2">
        <Label>Обложка проекта</Label>
        <div className="flex gap-4 items-start">
          {formData.coverImage && (
            <div className="w-40 h-28 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <Input
              type="text"
              value={formData.coverImage || ''}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              placeholder="URL обложки"
              className="mb-2"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('cover-upload')?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Загрузить
            </Button>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, true)}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Название проекта *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Например: Квартира в центре"
            required
          />
        </div>
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
      </div>

      {/* Details */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area">Площадь</Label>
          <Input
            id="area"
            value={formData.area || ''}
            onChange={(e) => handleChange('area', e.target.value)}
            placeholder="95 м²"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Локация</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Москва"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Год</Label>
          <Input
            id="year"
            value={formData.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
            placeholder="2024"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Описание проекта *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Подробное описание проекта..."
          rows={4}
          required
        />
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <Label>Фотографии галереи ({formData.images?.length || 0})</Label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {formData.images?.map((img, index) => (
            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <img src={img} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Добавить</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, false)}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Рекомендуется 10-20 фотографий. Поддерживается множественная загрузка.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
          {project ? 'Сохранить изменения' : 'Создать проект'}
        </Button>
      </div>
    </form>
  );
}

// Gallery Manager Component
function GalleryManager({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { updateProject, removeImageFromProject, reorderImages } = useProjects();
  const [localImages, setLocalImages] = useState(project.images);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const readers = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImages) => {
      const updated = [...localImages, ...newImages];
      setLocalImages(updated);
      updateProject(project.id, { images: updated });
      toast.success(`Добавлено ${newImages.length} фотографий`);
    });
  };

  const handleRemove = (index: number) => {
    removeImageFromProject(project.id, index);
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
    toast.success('Фотография удалена');
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= localImages.length) return;
    reorderImages(project.id, fromIndex, toIndex);
    const newImages = [...localImages];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setLocalImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{project.title}</h4>
          <p className="text-sm text-gray-500">{localImages.length} фотографий</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('gallery-add')?.click()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить фото
          </Button>
          <input
            id="gallery-add"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-auto p-1">
        {localImages.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
          >
            <img src={img} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            
            {/* Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => moveImage(index, index - 1)}
                disabled={index === 0}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <span className="text-xs">←</span>
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveImage(index, index + 1)}
                disabled={index === localImages.length - 1}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <span className="text-xs">→</span>
              </button>
            </div>
            
            {/* Index */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-black/60 text-white text-xs rounded-full flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onClose}>Готово</Button>
      </div>
    </div>
  );
}
