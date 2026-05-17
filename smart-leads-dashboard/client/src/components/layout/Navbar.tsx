import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import logo from '../../assets/logo.svg';
import { Modal } from '../ui/Modal';

export function Navbar() {
  const { user, logout } = useAuth();
  const [dark, toggleDark] = useDarkMode();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <>
      <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="GigFlow Logo" className="h-8 w-8 object-contain rounded-lg" />
        <span className="font-serif text-xl font-normal text-foreground">GigFlow</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {user?.name}
        </span>
        <Badge variant={user?.role === 'admin' ? 'accent' : 'default'}>
          {user?.role}
        </Badge>
        <button
          onClick={toggleDark}
          className="rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Button variant="ghost" size="sm" onClick={handleLogoutClick} className="gap-2">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
      </nav>

      {showLogoutConfirm && (
        <Modal open onClose={() => setShowLogoutConfirm(false)} title="Confirm Logout">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to log out of GigFlow?
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
            <Button onClick={confirmLogout}>Log Out</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
