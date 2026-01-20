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

// Mock data
const buildings = [
  { 
    id: 1, 
    name: 'Building A - Male',
    location: 'North Campus',
    totalRooms: 50,
    occupiedRooms: 45,
    capacity: 200,
    currentOccupancy: 178,
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Building B - Male',
    location: 'North Campus',
    totalRooms: 40,
    occupiedRooms: 38,
    capacity: 160,
    currentOccupancy: 152,
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Building C - Female',
    location: 'South Campus',
    totalRooms: 60,
    occupiedRooms: 55,
    capacity: 240,
    currentOccupancy: 220,
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Building D - Female',
    location: 'South Campus',
    totalRooms: 45,
    occupiedRooms: 30,
    capacity: 180,
    currentOccupancy: 110,
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Building E - Mixed',
    location: 'East Campus',
    totalRooms: 30,
    occupiedRooms: 0,
    capacity: 120,
    currentOccupancy: 0,
    status: 'maintenance'
  },
];

function BuildingCard({ building }: { building: typeof buildings[0] }) {
  const occupancyPercent = Math.round((building.currentOccupancy / building.capacity) * 100);
  
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <Badge 
            variant={building.status === 'active' ? 'default' : 'secondary'}
            className={building.status === 'active' 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-gold/10 text-gold-dark border-gold/20'
            }
          >
            {building.status === 'active' ? 'نشط' : 'قيد الصيانة'}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1">{building.name}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
          <MapPin className="w-4 h-4" />
          {building.location}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <DoorOpen className="w-4 h-4" />
              Rooms
            </span>
            <span className="font-medium">
              {building.occupiedRooms}/{building.totalRooms}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </span>
            <span className="font-medium">
              {building.currentOccupancy}/{building.capacity}
            </span>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Occupancy</span>
              <span className={`font-medium ${
                occupancyPercent > 90 ? 'text-destructive' : 
                occupancyPercent > 70 ? 'text-gold-dark' : 'text-success'
              }`}>
                {occupancyPercent}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  occupancyPercent > 90 ? 'bg-destructive' : 
                  occupancyPercent > 70 ? 'bg-gold' : 'bg-success'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit2 className="w-4 h-4 ml-1" />
            تعديل
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
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
  
  const filteredBuildings = buildings.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalCapacity = buildings.reduce((sum, b) => sum + b.capacity, 0);
  const totalOccupancy = buildings.reduce((sum, b) => sum + b.currentOccupancy, 0);
  
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
                  <Input id="name" placeholder="مثال: المبنى F - للذكور" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input id="location" placeholder="مثال: الحرم الغربي" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rooms">إجمالي الغرف</Label>
                    <Input id="rooms" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">إجمالي السعة</Label>
                    <Input id="capacity" type="number" placeholder="0" />
                  </div>
                </div>
                <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                  إنشاء المبنى
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
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
                  <p className="text-2xl font-bold">
                    {buildings.reduce((sum, b) => sum + b.totalRooms, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">إجمالي الغرف</p>
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
                  <p className="text-2xl font-bold">{totalCapacity}</p>
                  <p className="text-xs text-muted-foreground">إجمالي السعة</p>
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
                  <p className="text-2xl font-bold">{totalOccupancy}</p>
                  <p className="text-xs text-muted-foreground">الإشغال الحالي</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
