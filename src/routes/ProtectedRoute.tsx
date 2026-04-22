import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[]; // Bitta string emas, array qabul qilamiz
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const context = useContext(AuthContext);

    // 1. Context yuklanayotgan bo'lsa, "oq ekran" bo'lib qolmasligi kerak
    if (!context || context.loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-4 text-cyan-500 font-mono text-xs uppercase tracking-widest">Neura Security Check...</span>
            </div>
        );
    }

    const { user } = context;

    // 2. Foydalanuvchi login qilmagan bo'lsa
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Foydalanuvchi roli ruxsat berilganlar ro'yxatida bormi?
    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
        // Ruxsati bo'lmasa, uni o'zining asosiy dashboardiga qaytarib yuboramiz
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;