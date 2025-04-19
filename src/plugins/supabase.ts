// src/plugins/supabase.ts
import { App } from 'vue'
import { supabase } from '@/lib/supabase'

export default {
  install(app: App) {
    app.config.globalProperties.$supabase = supabase
  }
}
