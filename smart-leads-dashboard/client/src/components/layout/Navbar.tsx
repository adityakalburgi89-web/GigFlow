import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <span className="text-lg font-semibold text-gray-900">Smart Leads</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name} <span className="text-gray-400">({user?.role})</span>
        </span>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
