import { useAuth as useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useAuthContext();
  return {
    user: context.user,
    isAdmin: context.isAdmin,
    isLoading: context.isLoading,
    login: context.login,
    logout: context.logout
  };
}