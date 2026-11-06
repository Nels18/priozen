import type { JSX } from 'react';
import { Text, View } from 'react-native';
import type { User } from '@/src/types/models';
import { getInitials } from '@/src/utils/format';

interface AvatarProps {
  user: Pick<User, 'firstName' | 'lastName'>;
  size?: 'sm' | 'md';
}

const SIZE_CLASSES = {
  sm: { box: 'h-[34px] w-[34px]', text: 'text-caption' },
  md: { box: 'h-10 w-10', text: 'text-[15px]' },
} as const;

/** Round initials badge ("MD"). */
export function Avatar({ user, size = 'sm' }: AvatarProps): JSX.Element {
  const classes = SIZE_CLASSES[size];
  return (
    <View
      accessible={false}
      className={`items-center justify-center rounded-full bg-primary ${classes.box}`}
    >
      <Text className={`font-sans-bold text-white ${classes.text}`}>
        {getInitials(user)}
      </Text>
    </View>
  );
}
