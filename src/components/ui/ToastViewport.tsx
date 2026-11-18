import type { JSX, ReactNode } from 'react';
import { useEffect } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { useScreenSize } from '@/src/layout/screenSize';
import type { Toast, ToastHold } from '@/src/toast/toastQueue';
import { TOAST_DURATION_MS } from '@/src/toast/toastQueue';
import fixedColors from '@/src/theme/fixedColors';
import { Icon } from './Icon';

// Distance from the bottom edge when no layout sets one (signed-out screens).
const DEFAULT_BOTTOM_OFFSET = 24;
const TOAST_MAX_WIDTH = 400;

// Thin bar along the bottom of the toast, emptied by the countdown.
const countdownBarStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: 3,
  backgroundColor: fixedColors.toast.action,
  opacity: 0.6,
} as const;

// Short and skipped when the system asks to reduce motion (CLAUDE.md).
const entering = FadeInDown.duration(180).reduceMotion(ReduceMotion.System);
const exiting = FadeOut.duration(150).reduceMotion(ReduceMotion.System);
const layout = LinearTransition.duration(180).reduceMotion(ReduceMotion.System);

interface ToastViewportProps {
  toasts: Toast[];
  /** From the layout (bottom nav, "+" button); null for the default spot. */
  bottomOffset: number | null;
  /** Countdowns stopped: a toast is hovered or its action focused. */
  isPaused: boolean;
  onHold: (id: string, reason: ToastHold) => void;
  onRelease: (id: string, reason: ToastHold) => void;
  onAction: (toast: Toast) => void;
}

/**
 * Where toasts are drawn (mockup): bottom center on small screens, bottom right
 * on medium and large ones, newest closest to the edge. Above modals too.
 */
export function ToastViewport({
  toasts,
  bottomOffset,
  isPaused,
  onHold,
  onRelease,
  onAction,
}: ToastViewportProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const isSmall = useScreenSize() === 'small';

  return (
    <AboveModals>
      <View
        // Always mounted, so screen readers follow it as a live region.
        role="status"
        accessibilityLiveRegion="polite"
        pointerEvents="box-none"
        style={{
          bottom: bottomOffset ?? insets.bottom + DEFAULT_BOTTOM_OFFSET,
        }}
        className={`absolute left-0 right-0 gap-2 ${
          isSmall ? 'items-center px-4' : 'items-end px-6'
        }`}
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            isPaused={isPaused}
            onHold={(reason): void => onHold(toast.id, reason)}
            onRelease={(reason): void => onRelease(toast.id, reason)}
            onAction={(): void => onAction(toast)}
          />
        ))}
      </View>
    </AboveModals>
  );
}

/**
 * On iOS, modals are native screens drawn above the root view: an overlay
 * window keeps toasts visible on top of them. Elsewhere a plain layer is enough.
 */
function AboveModals({ children }: { children: ReactNode }): JSX.Element {
  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{children}</FullWindowOverlay>;
  }
  return (
    <View pointerEvents="box-none" className="absolute inset-0">
      {children}
    </View>
  );
}

interface ToastItemProps {
  toast: Toast;
  isPaused: boolean;
  onHold: (reason: ToastHold) => void;
  onRelease: (reason: ToastHold) => void;
  onAction: () => void;
}

function ToastItem({
  toast,
  isPaused,
  onHold,
  onRelease,
  onAction,
}: ToastItemProps): JSX.Element {
  // 1 → 0 over the toast's lifetime: the countdown bar empties, and stops
  // where it is during a pause.
  const remaining = useSharedValue(1);
  useEffect(() => {
    if (isPaused) {
      cancelAnimation(remaining);
      return;
    }
    remaining.value = withTiming(0, {
      duration: remaining.value * TOAST_DURATION_MS,
      easing: Easing.linear,
      // The bar tells how long the toast stays: kept with reduced motion.
      reduceMotion: ReduceMotion.Never,
    });
  }, [isPaused, remaining]);
  const countdownStyle = useAnimatedStyle(() => ({
    width: `${remaining.value * 100}%`,
  }));

  // Animated views only take `style`: classes go on the plain views inside.
  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      layout={layout}
      style={{ width: '100%', maxWidth: TOAST_MAX_WIDTH }}
    >
      <View
        // Mouse over a toast (web): time to read it, or to reach "Annuler".
        onPointerEnter={(): void => onHold('hover')}
        onPointerLeave={(): void => onRelease('hover')}
        className="min-h-[44px] flex-row items-center gap-3 overflow-hidden rounded-xl bg-toast py-1 pl-4 pr-2 shadow-lg"
      >
        <Icon
          name={toast.kind === 'success' ? 'checkmark-circle' : 'alert-circle'}
          size={18}
          color={toast.kind === 'success' ? 'success' : 'critical'}
        />
        {/* Two lines at most: a long task title ends with "…". */}
        <Text
          numberOfLines={2}
          className="flex-1 py-2 font-sans text-sm text-white"
        >
          {toast.message}
        </Text>
        {toast.action && (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            // Reached with Tab: the button must not vanish while focused.
            onFocus={(): void => onHold('focus')}
            onBlur={(): void => onRelease('focus')}
            hitSlop={4}
            className="min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2.5 active:bg-white/10"
          >
            <Text className="font-sans-bold text-sm text-toast-action">
              {toast.action.label}
            </Text>
          </Pressable>
        )}
        <Animated.View style={[countdownBarStyle, countdownStyle]} />
      </View>
    </Animated.View>
  );
}
