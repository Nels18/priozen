import { useRouter } from 'expo-router';
import { ROUTES } from './routes';

/**
 * Closes a modal route: back to the screen underneath, or to the tasks view
 * when the modal was opened directly (deep link, page reload on web).
 */
export const useCloseModal = (): (() => void) => {
  const router = useRouter();
  return (): void => {
    if (router.canGoBack()) router.back();
    else router.replace(ROUTES.tasks);
  };
};
