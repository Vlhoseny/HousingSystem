import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Settings as SettingsIcon,
  DollarSign,
  Calendar,
  Bell,
  Shield,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [globalFee, setGlobalFee] = useState('5000');
  const [applicationOpen, setApplicationOpen] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const handleSave = () => {
    toast.success('تم حفظ الإعدادات بنجاح');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات النظام</p>
        </div>
        
        {/* Housing Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-ocean" />
              رسوم السكن
            </CardTitle>
            <CardDescription>
              ضبط المبلغ الافتراضي لرسوم السكن
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="globalFee">الرسوم العامة للسكن (ج.م)</Label>
                <Input
                  id="globalFee"
                  type="number"
                  value={globalFee}
                  onChange={(e) => setGlobalFee(e.target.value)}
                  placeholder="أدخل المبلغ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateFee">رسوم التأخير (ج.م)</Label>
                <Input
                  id="lateFee"
                  type="number"
                  defaultValue="500"
                  placeholder="أدخل المبلغ"
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 سيتم تطبيق الرسوم العامة على جميع الطلبات الجديدة. يمكن تعديل الرسوم لكل طالب على حدة.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Application Window */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              نافذة التقديم
            </CardTitle>
            <CardDescription>
              التحكم بفترة قبول طلبات السكن
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">قبول الطلبات</p>
                <p className="text-sm text-muted-foreground">السماح بتقديم طلبات سكن جديدة</p>
              </div>
              <Switch
                checked={applicationOpen}
                onCheckedChange={setApplicationOpen}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <Input
                  id="startDate"
                  type="date"
                  defaultValue="2024-01-01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                <Input
                  id="endDate"
                  type="date"
                  defaultValue="2024-02-28"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-sunset" />
              الإشعارات
            </CardTitle>
            <CardDescription>
              إعداد كيفية إرسال الإشعارات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">إشعارات البريد الإلكتروني</p>
                <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">إشعارات الرسائل النصية</p>
                <p className="text-sm text-muted-foreground">إرسال إشعارات عبر الرسائل النصية</p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              الأمان
            </CardTitle>
            <CardDescription>
              إدارة إعدادات الأمان والوصول
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="أدخل كلمة المرور الحالية"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="تأكيد كلمة المرور الجديدة"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-start lg:justify-end">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
