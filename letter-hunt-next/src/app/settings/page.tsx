'use client';

/**
 * Settings Page
 * 
 * Configuration page for game settings.
 * Accessible via /settings route.
 * 
 * @module SettingsPage
 */

import { useGameStore } from '@/store/game-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Settings, Volume2, Eye, Zap, Save, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, loadSettings } = useGameStore();

  const handleToggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleToggleAnimations = () => {
    updateSettings({ animationsEnabled: !settings.animationsEnabled });
  };

  const handleToggleHints = () => {
    updateSettings({ showHints: !settings.showHints });
  };

  const handleToggleReducedMotion = () => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        reducedMotion: !settings.accessibility.reducedMotion,
      },
    });
  };

  const handleToggleHighContrast = () => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        highContrast: !settings.accessibility.highContrast,
      },
    });
  };

  const handleResetSettings = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración predeterminada?')) {
      loadSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Settings className="w-10 h-10 text-primary-500" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Configuración
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Personaliza tu experiencia de juego según tus preferencias.
        </p>
      </header>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Audio Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Volume2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Audio
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Sonidos</span>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={handleToggleSound}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Habilita o deshabilita los efectos de sonido durante el juego.
            </p>
          </div>
        </Card>

        {/* Visual Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Visual
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Animaciones</span>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={handleToggleAnimations}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Mostrar pistas</span>
              <Switch
                checked={settings.showHints}
                onCheckedChange={handleToggleHints}
              />
            </div>
          </div>
        </Card>

        {/* Accessibility Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-warning-600 dark:text-warning-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Accesibilidad
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Reducir movimiento</span>
              <Switch
                checked={settings.accessibility.reducedMotion}
                onCheckedChange={handleToggleReducedMotion}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Alto contraste</span>
              <Switch
                checked={settings.accessibility.highContrast}
                onCheckedChange={handleToggleHighContrast}
              />
            </div>
          </div>
        </Card>

        {/* Reset Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg">
              <RotateCcw className="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Restaurar
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Restaura todos los ajustes a sus valores predeterminados.
            </p>
            <Button
              variant="ghost"
              onClick={handleResetSettings}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar configuración
            </Button>
          </div>
        </Card>
      </div>

      {/* Save Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Save className="w-4 h-4" />
        <span>Los cambios se guardan automáticamente</span>
      </div>
    </div>
  );
}
