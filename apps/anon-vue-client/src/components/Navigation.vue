<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <RouterLink to="/chat">
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            Chat
          </NavigationMenuLink>
        </RouterLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/about">
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            About
          </NavigationMenuLink>
        </RouterLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
