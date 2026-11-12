import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { ROUTES } from '../navigation/routes';
import { isNewTaskShortcut } from './newTaskShortcut';

/** Web keyboard shortcut "N": opens the new task modal. */
export const useNewTaskShortcut = (): void => {
  const router = useRouter();
  const pathname = usePathname();
  // The modals stack above the app: no new one while one is open.
  const isModalOpen = pathname.startsWith('/tasks/');

  useEffect(() => {
    if (Platform.OS !== 'web' || isModalOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!isNewTaskShortcut(event)) return;
      event.preventDefault();
      router.push(ROUTES.newTask);
    };
    document.addEventListener('keydown', handleKeyDown);
    return (): void => document.removeEventListener('keydown', handleKeyDown);
  }, [router, isModalOpen]);
};
