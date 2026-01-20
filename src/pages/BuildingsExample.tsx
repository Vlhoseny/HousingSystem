// Example: Buildings page integrated with API
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
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
import {
    useBuildings,
    useCreateBuilding,
    useUpdateBuilding,
    useDeleteBuilding,
} from '@/hooks/useApi';
import type { BuildingDto } from '@/lib/types';

export default function BuildingsExample() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<BuildingDto | null>(null);
    const { toast } = useToast();

    // API hooks
    const { data: buildings, isLoading } = useBuildings();
    const createMutation = useCreateBuilding();
    const updateMutation = useUpdateBuilding();
    const deleteMutation = useDeleteBuilding();

    const handleCreateBuilding = async (formData: Omit<BuildingDto, 'buildingId'>) => {
        try {
            const response = await createMutation.mutateAsync(formData);
            if (response.error) {
                toast({
                    title: 'خطأ',
                    description: response.error,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'نجح',
                    description: 'تم إضافة المبنى بنجاح',
                });
                setIsAddDialogOpen(false);
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء إضافة المبنى',
                variant: 'destructive',
            });
        }
    };

    const handleUpdateBuilding = async (id: number, formData: Omit<BuildingDto, 'buildingId'>) => {
        try {
            const response = await updateMutation.mutateAsync({ id, data: formData });
            if (response.error) {
                toast({
                    title: 'خطأ',
                    description: response.error,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'نجح',
                    description: 'تم تحديث المبنى بنجاح',
                });
                setEditingBuilding(null);
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء تحديث المبنى',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteBuilding = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا المبنى؟')) return;

        try {
            const response = await deleteMutation.mutateAsync(id);
            if (response.error) {
                toast({
                    title: 'خطأ',
                    description: response.error,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'نجح',
                    description: 'تم حذف المبنى بنجاح',
                });
            }
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء حذف المبنى',
                variant: 'destructive',
            });
        }
    };

    // Filter buildings based on search
    const filteredBuildings = buildings?.filter((building) =>
        building.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">إدارة المباني</h1>
                        <p className="text-muted-foreground mt-2">
                            إدارة المباني والغرف السكنية
                        </p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                إضافة مبنى
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>إضافة مبنى جديد</DialogTitle>
                            </DialogHeader>
                            <BuildingForm
                                onSubmit={handleCreateBuilding}
                                isLoading={createMutation.isPending}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="البحث عن مبنى..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Buildings Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-64" />
                        ))}
                    </div>
                ) : filteredBuildings.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? 'لم يتم العثور على مبانٍ' : 'لا توجد مبانٍ حالياً'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBuildings.map((building) => (
                            <BuildingCard
                                key={building.buildingId}
                                building={building}
                                onEdit={() => setEditingBuilding(building)}
                                onDelete={() => handleDeleteBuilding(building.buildingId)}
                            />
                        ))}
                    </div>
                )}

                {/* Edit Dialog */}
                {editingBuilding && (
                    <Dialog open={!!editingBuilding} onOpenChange={() => setEditingBuilding(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>تعديل المبنى</DialogTitle>
                            </DialogHeader>
                            <BuildingForm
                                building={editingBuilding}
                                onSubmit={(data) => handleUpdateBuilding(editingBuilding.buildingId, data)}
                                isLoading={updateMutation.isPending}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </DashboardLayout>
    );
}

// Building Card Component
function BuildingCard({
    building,
    onEdit,
    onDelete
}: {
    building: BuildingDto;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <Card className="card-hover">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={building.status === 'active' ? 'default' : 'secondary'}>
                        {building.status || 'غير محدد'}
                    </Badge>
                </div>

                <h3 className="text-lg font-semibold mb-2">{building.name || 'بدون اسم'}</h3>
                <p className="text-sm text-muted-foreground mb-4">{building.type || 'غير محدد'}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">عدد الطوابق</span>
                        <span className="font-medium">{building.numberOfFloors || 0}</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        تعديل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={onDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        حذف
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Building Form Component
function BuildingForm({
    building,
    onSubmit,
    isLoading,
}: {
    building?: BuildingDto;
    onSubmit: (data: Omit<BuildingDto, 'buildingId'>) => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState<Omit<BuildingDto, 'buildingId'>>({
        name: building?.name || '',
        type: building?.type || '',
        numberOfFloors: building?.numberOfFloors || 1,
        status: building?.status || 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">اسم المبنى</Label>
                <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="type">النوع</Label>
                <Input
                    id="type"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="مثال: طلاب، طالبات"
                />
            </div>

            <div>
                <Label htmlFor="floors">عدد الطوابق</Label>
                <Input
                    id="floors"
                    type="number"
                    min="1"
                    value={formData.numberOfFloors}
                    onChange={(e) => setFormData({ ...formData, numberOfFloors: parseInt(e.target.value) })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="status">الحالة</Label>
                <Input
                    id="status"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="مثال: active, maintenance"
                />
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'جاري الحفظ...' : building ? 'تحديث' : 'إضافة'}
                </Button>
            </DialogFooter>
        </form>
    );
}
