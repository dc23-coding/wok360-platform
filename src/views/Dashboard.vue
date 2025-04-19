<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </header>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-4">📦 Load Widget</div>
        <div class="bg-white rounded-xl shadow p-4">⛽ Fuel Widget</div>
        <div class="bg-white rounded-xl shadow p-4">🛏️ Rest Widget</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import supabase from '@/plugins/supabase';
  </script>
  