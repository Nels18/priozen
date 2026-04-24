import type { JSX } from 'react';
import { Text, View } from 'react-native';

export default function Index(): JSX.Element {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
