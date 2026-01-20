import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Building2,
  Plus,
  MapPin,
  Users,
  DoorOpen,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { useBuildings, useUpdateBuilding, useCreateBuilding, useDeleteBuilding } from '@/hooks/useApi';
import type { BuildingDto } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Note: Data is fetched from API via useBuildings().

function BuildingCard({
  building,
  onEdit,
  onDelete,
}: {
  building: BuildingDto;
  onEdit: (b: BuildingDto) => void;
  onDelete: (id: number) => void;
}) {
  const occupancyPercent = 0; // Placeholder as API does not provide occupancy/capacity

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <Badge
            variant={'default'}
            className={
              building.status === 'نشط'
                ? 'bg-success/10 text-success border-success/20'
                : building.status === 'تحت الصيانة'
                  ? 'bg-gold/10 text-gold-dark border-gold/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
            }
          >
            {building.status || '—'}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-1">{building.name || '—'}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
          <MapPin className="w-4 h-4" />
          {building.type || '—'}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <DoorOpen className="w-4 h-4" />
              عدد الطوابق
            </span>
            <span className="font-medium">
              {building.numberOfFloors ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              رقم المبنى
            </span>
            <span className="font-medium">
              {building.buildingId}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Occupancy</span>
              <span className={`font-medium ${occupancyPercent > 90 ? 'text-destructive' :
                occupancyPercent > 70 ? 'text-gold-dark' : 'text-success'
                }`}>
                {occupancyPercent}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${occupancyPercent > 90 ? 'bg-destructive' :
                  occupancyPercent > 70 ? 'bg-gold' : 'bg-success'
                  }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(building)}
          >
            <Edit2 className="w-4 h-4 ml-1" />
            تعديل
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(building.buildingId)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Buildings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingDto | null>(null);
  const [editFormData, setEditFormData] = useState<BuildingDto | null>(null);
  const [addFormData, setAddFormData] = useState<Omit<BuildingDto, 'buildingId'>>({
    name: '',
    type: '',
    numberOfFloors: 0,
    status: '',
  });

  const { data: buildings = [], isLoading, error } = useBuildings();
  const updateBuilding = useUpdateBuilding();
  const createBuilding = useCreateBuilding();
  const deleteBuilding = useDeleteBuilding();
  const { toast } = useToast();

  const filteredBuildings = buildings.filter((b: BuildingDto) =>
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.type || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFloors = buildings.reduce((sum: number, b: BuildingDto) => sum + (b.numberOfFloors || 0), 0);

  const handleEditOpen = (building: BuildingDto) => {
    setEditingBuilding(building);
    setEditFormData({ ...building });
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (field: keyof BuildingDto, value: any) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const handleEditSave = async () => {
    if (!editingBuilding || !editFormData) return;
    try {
      await updateBuilding.mutateAsync({
        id: editingBuilding.buildingId,
        data: {
          name: editFormData.name,
          type: editFormData.type,
          numberOfFloors: editFormData.numberOfFloors,
          status: editFormData.status,
        },
      });
      toast({ title: 'تم الحفظ بنجاح', description: 'تم تحديث بيانات المبنى.' });
      setIsEditDialogOpen(false);
      setEditingBuilding(null);
      setEditFormData(null);
    } catch (err) {
      toast({ title: 'فشل الحفظ', description: 'تعذر تحديث المبنى. حاول مرة أخرى.' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBuilding.mutateAsync(id);
      toast({ title: 'تم الحذف', description: 'تم حذف المبنى بنجاح.' });
    } catch (err) {
      toast({ title: 'فشل الحذف', description: 'تعذر حذف المبنى. حاول مرة أخرى.' });
    }
  };

  const handleAddChange = (field: keyof Omit<BuildingDto, 'buildingId'>, value: any) => {
    setAddFormData({ ...addFormData, [field]: value });
  };

  const handleAddSave = async () => {
    try {
      await createBuilding.mutateAsync(addFormData);
      toast({ title: 'تم الإنشاء', description: 'تم إضافة المبنى بنجاح.' });
      setIsAddDialogOpen(false);
      setAddFormData({ name: '', type: '', numberOfFloors: 0, status: '' });
    } catch (err) {
      toast({ title: 'فشل الإنشاء', description: 'تعذر إنشاء المبنى. حاول مرة أخرى.' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">المباني</h1>
            <p className="text-muted-foreground">إدارة مباني الإسكان والمرافق</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 ml-2" />
                إضافة مبنى
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مبنى جديد</DialogTitle>
                <DialogDescription>
                  إنشاء مبنى جديد في نظام الإسكان
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المبنى</Label>
                  <Input
                    id="name"
                    placeholder="مثال: المبنى F - للذكور"
                    value={addFormData.name || ''}
                    onChange={(e) => handleAddChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">النوع</Label>
                  <Input
                    id="type"
                    placeholder="مثال: سكني"
                    value={addFormData.type || ''}
                    onChange={(e) => handleAddChange('type', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floors">عدد الطوابق</Label>
                    <Input
                      id="floors"
                      type="number"
                      placeholder="0"
                      value={addFormData.numberOfFloors || 0}
                      onChange={(e) => handleAddChange('numberOfFloors', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={addFormData.status || ''}
                      onValueChange={(v) => handleAddChange('status', v)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="نشط">نشط</SelectItem>
                        <SelectItem value="تحت الصيانة">تحت الصيانة</SelectItem>
                        <SelectItem value="لا يعمل">لا يعمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddSave} disabled={createBuilding.isPending}>
                  {createBuilding.isPending ? 'جاري الإنشاء...' : 'إنشاء المبنى'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error / Loading */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 text-destructive">
              فشل في تحميل المباني: {error instanceof Error ? error.message : 'خطأ غير معروف'}
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardContent className="p-4 text-center text-muted-foreground">جاري تحميل المباني...</CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buildings.length}</p>
                  <p className="text-xs text-muted-foreground">إجمالي المباني</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center">
                  <DoorOpen className="w-5 h-5 text-ocean" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalFloors}</p>
                  <p className="text-xs text-muted-foreground">إجمالي الطوابق</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buildings.filter((b: BuildingDto) => (b.status || '') === 'نشط').length}</p>
                  <p className="text-xs text-muted-foreground">المباني النشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buildings.filter((b: BuildingDto) => (b.status || '') !== 'نشط').length}</p>
                  <p className="text-xs text-muted-foreground">غير النشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث في المباني..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Buildings Grid */}
        {!isLoading && buildings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.map((building: BuildingDto) => (
              <BuildingCard
                key={building.buildingId}
                building={building}
                onEdit={handleEditOpen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && buildings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">لا توجد مباني متاحة</CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل المبنى</DialogTitle>
              <DialogDescription>قم بتحديث معلومات المبنى</DialogDescription>
            </DialogHeader>

            {editFormData && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">اسم المبنى</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name || ''}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">النوع</Label>
                  <Input
                    id="edit-type"
                    value={editFormData.type || ''}
                    onChange={(e) => handleEditChange('type', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-floors">عدد الطوابق</Label>
                  <Input
                    id="edit-floors"
                    type="number"
                    value={editFormData.numberOfFloors || 0}
                    onChange={(e) => handleEditChange('numberOfFloors', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select
                    value={editFormData.status || ''}
                    onValueChange={(v) => handleEditChange('status', v)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="تحت الصيانة">تحت الصيانة</SelectItem>
                      <SelectItem value="لا يعمل">لا يعمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleEditSave} disabled={updateBuilding.isPending}>
                  {updateBuilding.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
