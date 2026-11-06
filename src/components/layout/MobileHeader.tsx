import type { JSX } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { User } from '@/src/types/models';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

export function MobileHeader({ user }: { user: User }): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 14 }}
      className="flex-row items-center justify-between border-b border-border bg-card px-5 pb-2.5"
    >
      <Logo className="text-[22px]" />
      <Avatar user={user} />
    </View>
  );
}
