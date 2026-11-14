import { Icon } from '@/src/components/ui/Icon';
import type { JSX, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenSize } from '@/src/layout/screenSize';

interface TaskModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// id of the modal's root element on web (nativeID): one modal at a time.
const MODAL_ROOT_ID = 'task-modal-root';

/**
 * Makes everything outside `root` inert (no focus, no clicks, hidden from
 * screen readers): each sibling of `root` and of its ancestors. Returns the
 * function that undoes it.
 */
const makeOutsideInert = (root: Element): (() => void) => {
  const changed: Element[] = [];
  for (
    let node: Element = root;
    node.parentElement && node !== document.body;
    node = node.parentElement
  ) {
    for (const sibling of Array.from(node.parentElement.children)) {
      if (sibling !== node && !sibling.hasAttribute('inert')) {
        sibling.setAttribute('inert', '');
        changed.push(sibling);
      }
    }
  }
  return (): void => {
    for (const element of changed) element.removeAttribute('inert');
  };
};

/**
 * Web only, while the modal is open:
 * - Tab stays inside it: the app underneath is inert (WCAG 2.4.3);
 * - Escape closes it;
 * - the focus then goes back to whatever opened it (the "+" button, a task…).
 */
const useWebDialogBehavior = (onClose: () => void): void => {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  // Read during the first render: by the time effects run, the title field
  // (autoFocus) already holds the focus.
  const [trigger] = useState(() =>
    Platform.OS === 'web' ? document.activeElement : null,
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    // Capture phase: React Native Web's TextInput stops key events from
    // bubbling, and the focus is usually in a field.
    document.addEventListener('keydown', handleKeyDown, true);
    const root = document.getElementById(MODAL_ROOT_ID);
    const restoreOutside = root ? makeOutsideInert(root) : (): void => {};
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown, true);
      // Interactive again first: an inert element can't take the focus.
      restoreOutside();
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, [trigger]);
};

/**
 * Frame of the task modal (mockup): bottom sheet on small screens, centered
 * 520px dialog above. The dimmed backdrop closes it, like the ✕ button.
 */
export function TaskModal({
  title,
  onClose,
  children,
}: TaskModalProps): JSX.Element {
  const { t } = useTranslation('tasks');
  const insets = useSafeAreaInsets();
  const isSheet = useScreenSize() === 'small';
  useWebDialogBehavior(onClose);

  return (
    <KeyboardAvoidingView
      nativeID={MODAL_ROOT_ID}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className={`flex-1 ${
        isSheet ? 'justify-end pt-11' : 'items-center justify-center p-4'
      }`}
    >
      {/* Pointer shortcut only: keyboard and screen readers use ✕ / Escape. */}
      <Pressable
        aria-hidden
        tabIndex={-1}
        onPress={onClose}
        className="absolute inset-0 bg-scrim"
      />

      <View
        role="dialog"
        aria-modal
        accessibilityViewIsModal
        accessibilityLabel={title}
        className={`max-h-full w-full bg-card ${
          isSheet ? 'rounded-t-sheet' : 'max-w-dialog rounded-lg shadow-xl'
        }`}
      >
        {isSheet && (
          <View aria-hidden className="items-center pt-2.5">
            <View className="h-1 w-9 rounded-full bg-border" />
          </View>
        )}

        <View
          className={`flex-row items-center justify-between ${
            isSheet ? 'py-1 pl-5 pr-3' : 'pb-2 pl-7 pr-5 pt-5'
          }`}
        >
          <Text
            accessibilityRole="header"
            className={`font-serif text-text ${
              isSheet ? 'text-2xl' : 'text-greeting'
            }`}
          >
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('form.close')}
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full active:bg-input"
          >
            <Icon name="close" size={22} color="muted" />
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName={isSheet ? 'px-5 pt-2' : 'px-7 pt-2'}
          contentContainerStyle={{ paddingBottom: isSheet ? insets.bottom : 0 }}
        >
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
