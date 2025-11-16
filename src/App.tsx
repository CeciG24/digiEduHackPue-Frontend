import { useState } from 'react';
import { Starfield } from './components/Starfield';
import { Navigation } from './components/Navigation';
import { WelcomeConsole } from './components/screens/WelcomeConsole';
import { MissionMap } from './components/screens/MissionMap';
import { LearningPathOverview } from './components/screens/LearningPathOverview'; // ✅ Asegúrate de importar el nuevo componente
import { ModuleMap } from './components/screens/ModuleMap';
import { LessonViewer } from './components/screens/LessonViewer';
import { Assessment } from './components/screens/Assessment';
import { AICore } from './components/screens/AICore';
import { AccessibilityTools } from './components/screens/AccessibilityTools';
import { Login } from './components/screens/Login';
import { Register } from './components/screens/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

interface NavigationData {
  pathId?: string;
  moduleId?: string;
  lessonId?: string;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(isAuthenticated ? 'welcome' : 'login');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  // En tu App.tsx, actualiza handleNavigate:
const handleNavigate = (screen: string, data?: NavigationData) => {
  console.log('📍 handleNavigate llamado desde:');
  console.trace(); // ✅ Esto te mostrará el stack trace
  console.log('Navegando a:', screen, 'con datos:', data);
  setCurrentScreen(screen);
  if (data) {
    setNavigationData({ ...navigationData, ...data });
  }
};

  const handleBack = () => {
    if (currentScreen === 'path-overview') {
      setCurrentScreen('map');
      setNavigationData({}); // Limpia los datos al volver
    } else if (currentScreen === 'module-map') {
      setCurrentScreen('path-overview');
      // Mantiene pathId pero limpia moduleId
      setNavigationData({ pathId: navigationData.pathId });
    } else if (currentScreen === 'lesson' || currentScreen === 'assessment') {
      setCurrentScreen('module-map');
      // Mantiene pathId y moduleId
      setNavigationData({ 
        pathId: navigationData.pathId,
        moduleId: navigationData.moduleId 
      });
    }
  };

  const renderScreen = () => {
    // Auth screens
    if (!isAuthenticated) {
      if (authScreen === 'login') {
        return (
          <Login 
            onNavigate={() => setCurrentScreen('welcome')}
            onSwitchToRegister={() => setAuthScreen('register')}
          />
        );
      } else {
        return (
          <Register 
            onNavigate={() => setCurrentScreen('welcome')}
            onSwitchToLogin={() => setAuthScreen('login')}
          />
        );
      }
    }

    // Main app screens
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeConsole onNavigate={handleNavigate} />;
      
      case 'map':
        return <MissionMap onNavigate={handleNavigate} />;
      
      case 'path-overview':
        return (
          <LearningPathOverview 
            pathId={navigationData.pathId || '1'} // ✅ Usa el ID real de la ruta
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        );
      
      case 'module-map':
        return (
          <ModuleMap
            moduleId={navigationData.moduleId || '1'} // ✅ Usa el ID real del módulo
            pathId={navigationData.pathId || '1'}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        );
      
      case 'lesson':
        return <LessonViewer />;
      
      case 'assessment':
        return <Assessment />;
      
      case 'ai-core':
        return <AICore />;
      
      case 'accessibility':
        return <AccessibilityTools />;
      
      default:
        return <WelcomeConsole onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <Starfield />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      
      {isAuthenticated && <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />}
      
      <main className={isAuthenticated ? 'relative z-10 ml-20' : 'relative z-10'}>
        {renderScreen()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}