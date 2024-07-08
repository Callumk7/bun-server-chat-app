<script setup lang="ts">
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Button from "../ui/button/Button.vue";
import { MenuIcon } from "lucide-vue-next";

defineEmits(["flag", "hide", "report"]);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="icon-sm" variant="ghost">
        <MenuIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Options</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="$emit('flag')">Flag</DropdownMenuItem>
      <DropdownMenuItem @click="$emit('hide')">Hide</DropdownMenuItem>
      <DropdownMenuItem @click="$emit('report')">Report</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
