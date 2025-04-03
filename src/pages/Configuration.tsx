// React
import { useState, useEffect } from 'react';

// Recoil
import { useRecoilState } from 'recoil';
import { darkModeAtom } from '../atoms';

// Componentes
import Button from '@/components/Button';
import { Card } from '@/components/Cards/Card';
import { RadixRadioGroup } from '@/components/RadioGroup';
import { Divider } from '@/components/Divider';
import { Switch } from '@/components/Switch';

// Iconos o SVGs
import { FaGlobe as Globe } from '@react-icons/all-files/fa/FaGlobe';
import { FaMoon as Moon } from '@react-icons/all-files/fa/FaMoon';
import { FaSun as Sun } from '@react-icons/all-files/fa/FaSun';

export const SettingsPage = () => {
  const [dark, setDark] = useRecoilState(darkModeAtom);
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState('es');

  // Ensure theme component renders correctly after hydration
  useEffect(() => {
    setMounted(true);
    // Load saved language from localStorage if available
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleThemeToggle = () => {
    setDark(!dark);
  };

  // Avoid rendering with incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <div className={`py-[12px] px-[24px] overflow-y-auto w-full`} data-testid="settings">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      <div className="gap-6 flex flex-col">
        <Card title="Apariencia" description="Personaliza la apariencia visual de la aplicación">
          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="theme-toggle" className="select-none">
                  Tema Oscuro
                </label>
                <p className="text-sm text-muted-foreground select-none">
                  Cambia entre el tema claro y oscuro
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <Switch id="theme-toggle" value={dark} onChange={handleThemeToggle} />
                <Moon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </Card>
        <Card title="Idioma" description="Selecciona el idioma de la interfaz">
          <div className="space-y-4">
            <div className="mt-6 flex flex-col gap-4">
              <RadixRadioGroup
                value={language}
                onChange={handleLanguageChange}
                items={[
                  { value: 'es', label: 'Español' },
                  { value: 'en', label: 'Ingles' },
                ]}
              />

              <div className="flex flex-col gap-2 w-[350px]">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Aplicar cambios de idioma
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Los cambios de idioma se aplicarán en la próxima carga de la página
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Notificaciones" description="Configura tus preferencias de notificaciones">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="notifications-email">Notificaciones por email</label>
              <Switch value={false} onChange={() => {}} id="notifications-email" />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <label htmlFor="notifications-push">Notificaciones push</label>
              <Switch value={false} onChange={() => {}} id="notifications-push" />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <label htmlFor="notifications-updates">Actualizaciones del sistema</label>
              <Switch value={false} onChange={() => {}} id="notifications-updates" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
