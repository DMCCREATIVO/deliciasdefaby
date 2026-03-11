import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { pb } from "@/lib/pocketbase/client";
import { toast } from "sonner";

interface User {
  id: string;
  isAdmin: boolean;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cache para evitar verificaciones repetidas
  const adminStatusCache = useRef<Map<string, boolean>>(new Map());
  const lastCheckTime = useRef<Map<string, number>>(new Map());
  const isCheckingAdmin = useRef(false);

  // Tiempo de cache en milisegundos (5 minutos)
  const CACHE_DURATION = 5 * 60 * 1000;

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    if (isCheckingAdmin.current) {
      return adminStatusCache.current.get(userId) || false;
    }

    const cachedResult = adminStatusCache.current.get(userId);
    const lastCheck = lastCheckTime.current.get(userId) || 0;
    const now = Date.now();

    if (cachedResult !== undefined && (now - lastCheck) < CACHE_DURATION) {
      return cachedResult;
    }

    isCheckingAdmin.current = true;

    try {
      // El campo 'role' está en la colección 'users' (no en 'profiles')
      // Primero verificar el modelo en cache del authStore
      const model = pb.authStore.model;
      if (model?.role) {
        const isAdmin = model.role === 'admin';
        adminStatusCache.current.set(userId, isAdmin);
        lastCheckTime.current.set(userId, now);
        return isAdmin;
      }

      // Si no está en caché, consultar directamente
      const userData = await pb.collection('users').getOne(userId);
      const isAdmin = userData?.role === 'admin';

      adminStatusCache.current.set(userId, isAdmin);
      lastCheckTime.current.set(userId, now);
      return isAdmin;
    } catch (error) {
      console.error('[Auth] Error al obtener rol del usuario:', error);
      return false;
    } finally {
      isCheckingAdmin.current = false;
    }
  }, []);

  const updateAuthState = useCallback(async (authModel: any) => {
    if (!authModel) {
      setUser(null);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const isUserAdmin = await checkAdminStatus(authModel.id);

    const userData = {
      id: authModel.id,
      isAdmin: isUserAdmin,
      email: authModel.email,
      name: authModel.name || authModel.username || '',
      phone: authModel.phone || '',
      address: authModel.address || ''
    };

    setUser(userData);
    setIsAdmin(isUserAdmin);
    setIsLoading(false);
  }, [checkAdminStatus]);

  useEffect(() => {
    let mounted = true;

    // Verificar sesión actual al montar el componente
    const initializeAuth = async () => {
      try {
        // PocketBase mantiene la sesión automáticamente
        const authModel = pb.authStore.model;

        if (mounted) {
          await updateAuthState(authModel);
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Suscribirse a cambios en la autenticación de PocketBase
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (mounted) {
        setIsLoading(true);
        updateAuthState(model);
      }
    });

    // Cleanup al desmontar
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [updateAuthState]);

  // Limpiar cache cuando el usuario cambia
  useEffect(() => {
    if (!user) {
      adminStatusCache.current.clear();
      lastCheckTime.current.clear();
    }
  }, [user]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAdmin(userData.isAdmin);
    // Actualizar cache
    adminStatusCache.current.set(userData.id, userData.isAdmin);
    lastCheckTime.current.set(userData.id, Date.now());
  }, []);

  const logout = useCallback(async () => {
    try {
      pb.authStore.clear();
      setUser(null);
      setIsAdmin(false);
      // Limpiar cache
      adminStatusCache.current.clear();
      lastCheckTime.current.clear();
      toast.success("Has cerrado sesión correctamente");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error("Error al cerrar sesión");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

