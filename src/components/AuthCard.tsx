import type { JSX, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

/**
 * Centered card (max 400px) used by every auth screen — same layout on
 * mobile, tablet and desktop, never a sidebar (see responsive mockup).
 */
export function AuthCard({ children }: { children: ReactNode }): JSX.Element {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-page"
    >
      <ScrollView
        contentContainerClassName="grow items-center justify-center px-4 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[400px] rounded-lg border border-border bg-card px-8 py-9 shadow-md">
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
