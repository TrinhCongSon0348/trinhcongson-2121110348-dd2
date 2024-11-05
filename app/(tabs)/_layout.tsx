import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>

      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      {/* Login Tab */}
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'log-in' : 'log-in-outline'} color={color} />
          ),
        }}
      />

      {/* Register Tab */}
      <Tabs.Screen
        name="register"
        options={{
          title: 'Register',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-add' : 'person-add-outline'} color={color} />
          ),
        }}
      />

      {/* Ẩn Tab Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          tabBarButton: () => null, // Ẩn tab Cart
        }}
      />

      {/* Ẩn Tab Detail */}
      <Tabs.Screen
        name="detail"
        options={{
          tabBarButton: () => null, // Ẩn tab Detail
        }}
      />

      {/* Ẩn Tab Payment */}
      
      <Tabs.Screen
        name="payment"
        options={{
          tabBarButton: () => null, // Ẩn tab Detail
        }}
      />

            {/* Ẩn Tab password */}
      
            <Tabs.Screen
        name="changepassword"
        options={{
          tabBarButton: () => null, // Ẩn tab Detail
        }}
      />
    </Tabs>
  );
}
