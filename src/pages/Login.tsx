import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/hurghada-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Building2, Users, CreditCard } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with username:', username);
      const result = await login(username, password);
      console.log('Login result:', result);

      if (result.success) {
        console.log('Login successful, navigating to dashboard...');
        // Use replace to prevent back button issues
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Login failed:', result.error);
        setError(result.error || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login exception:', error);
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for development
  const handleDemoLogin = async () => {
    // For demo purposes, simulate a successful login with admin credentials
    // You can replace these with actual test credentials
    setIsLoading(true);
    const result = await login('admin', 'admin123');

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      // If demo credentials don't work, create a manual session
      const demoUser = { id: 1, username: 'admin', role: 'Admin' };
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      window.location.href = '/dashboard';
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Wave Pattern */}
        <div className="absolute inset-0 wave-pattern opacity-20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="animate-fade-in">
            <img
              src={logo}
              alt="جامعة الغردقة"
              className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl"
            />
            <h1 className="text-4xl font-bold text-white mb-4">
              جامعة الغردقة
            </h1>
            <h2 className="text-2xl text-ocean-light mb-8">
              نظام إدارة الإسكان
            </h2>
          </div>

          {/* Features */}
          <div className="grid gap-6 mt-8 animate-slide-up delay-200">
            <div className="flex items-center gap-4 text-right bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-ocean flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">إدارة المباني</h3>
                <p className="text-sm text-white/70">إدارة الغرف والمرافق</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gold flex items-center justify-center">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-white">سكن الطلاب</h3>
                <p className="text-sm text-white/70">معالجة الطلبات بكفاءة</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-sunset flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">متابعة المدفوعات</h3>
                <p className="text-sm text-white/70">مراقبة الرسوم والمدفوعات</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-ocean/20 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img src={logo} alt="جامعة الغردقة" className="w-20 h-20 mb-4" />
            <h1 className="text-2xl font-bold text-foreground">إدارة الإسكان</h1>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl shadow-soft p-8 border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">مرحبًا بعودتك</h2>
              <p className="text-muted-foreground mt-2">سجّل الدخول للوصول إلى لوحة التحكم</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 ml-2" />
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>

            {/* Demo Login */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-muted-foreground mb-4">
                لأغراض العرض
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={handleDemoLogin}
              >
                المتابعة بحساب تجريبي
              </Button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2024 جامعة الغردقة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
