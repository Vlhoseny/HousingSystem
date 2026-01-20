import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useApplications } from '@/hooks/useApi';
import type { ApplicationDetails } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-gold/10 text-gold-dark border-gold/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  const labels: Record<string, string> = {
    pending: 'قيد الانتظار',
    approved: 'مقبول',
    rejected: 'مرفوض',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {labels[status] || status}
    </span>
  );
}

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetails | null>(null);

  const { data: applications = [], isLoading, error } = useApplications();
  const normalizeApplication = (app: any): ApplicationDetails => {
    const studentInfo = app.studentInfo || app.student || app.studentData || app.studentDto || {};
    const fatherInfo = app.fatherInfo || app.father || app.fatherData || undefined;
    const guardianInfo = app.guardianInfo || app.guardian || app.guardianData || undefined;
    const secondaryInfo = app.secondaryInfo || app.secondary || app.secondaryData || undefined;
    const academicInfo = app.academicInfo || app.academic || app.academicData || undefined;

    return {
      applicationId: app.applicationId ?? app.applicationID ?? app.id ?? 0,
      studentId: app.studentId ?? studentInfo.studentId ?? 0,
      studentName: app.studentName || studentInfo.fullName || studentInfo.name || 'غير متوفر',
      status: app.status || app.applicationStatus || 'pending',
      submittedAt: app.submittedAt || app.submissionDate || app.createdAt || '',
      studentInfo,
      fatherInfo,
      guardianInfo,
      secondaryInfo,
      academicInfo,
    } as ApplicationDetails;
  };

  const normalizedApplications = Array.isArray(applications)
    ? applications.map(normalizeApplication)
    : Array.isArray((applications as any)?.data)
      ? (applications as any).data.map(normalizeApplication)
      : [];

  const filteredApplications = normalizedApplications.filter(app => {
    const matchesSearch =
      app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentInfo?.nationalId?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6 text-center text-destructive">
            فشل في تحميل البيانات: {error instanceof Error ? error.message : 'خطأ غير معروف'}
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            جاري تحميل الطلبات...
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الطلبات</h1>
            <p className="text-muted-foreground">إدارة طلبات سكن الطلاب</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredApplications.length} طلب
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gold/5 border-gold/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {normalizedApplications.filter(a => a.status === 'pending').length}
                  </p>
                  <p className="text-xs text-muted-foreground">قيد الانتظار</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {normalizedApplications.filter(a => a.status === 'approved').length}
                  </p>
                  <p className="text-xs text-muted-foreground">مقبول</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {normalizedApplications.filter(a => a.status === 'rejected').length}
                  </p>
                  <p className="text-xs text-muted-foreground">مرفوض</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-ocean/5 border-ocean/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-ocean" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {normalizedApplications.length}
                  </p>
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم أو الرقم القومي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="فرز حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="approved">مقبول</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الطالب</TableHead>
                    <TableHead>الرقم القومي</TableHead>
                    <TableHead>الكلية</TableHead>
                    <TableHead>المرحلة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإرسال</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.applicationId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {app.studentName?.split(' ').slice(0, 2).map(n => n[0]).join('') || 'NA'}
                            </span>
                          </div>
                          <span className="font-medium">{app.studentName || 'غير متوفر'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{app.studentInfo?.nationalId || '—'}</TableCell>
                      <TableCell>{app.studentInfo?.faculty || '—'}</TableCell>
                      <TableCell>{app.studentInfo?.level ? `المرحلة ${app.studentInfo.level}` : '—'}</TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center justify-start gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {app.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="text-success hover:text-success">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Application Details Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تفاصيل الطلب</DialogTitle>
              <DialogDescription>
                مراجعة طلب سكن الطالب
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {selectedApplication.studentName?.split(' ').slice(0, 2).map(n => n[0]).join('') || 'NA'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedApplication.studentName || 'غير متوفر'}</h3>
                    <p className="text-muted-foreground">{selectedApplication.studentInfo?.email || '—'}</p>
                    <StatusBadge status={selectedApplication.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">الرقم القومي</p>
                    <p className="font-medium font-mono">{selectedApplication.studentInfo?.nationalId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <p className="font-medium">{selectedApplication.studentInfo?.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الكلية</p>
                    <p className="font-medium">{selectedApplication.studentInfo?.faculty || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">القسم</p>
                    <p className="font-medium">{selectedApplication.studentInfo?.department || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المرحلة</p>
                    <p className="font-medium">{selectedApplication.studentInfo?.level ? `المرحلة ${selectedApplication.studentInfo.level}` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الإرسال</p>
                    <p className="font-medium">
                      {selectedApplication.submittedAt ? new Date(selectedApplication.submittedAt).toLocaleString() : '—'}
                    </p>
                  </div>
                </div>

                {selectedApplication.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button className="flex-1 bg-success hover:bg-success/90">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      اعتماد الطلب
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="w-4 h-4 ml-2" />
                      رفض الطلب
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
