// src/composables/useUser.ts
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';

const user = ref<any>(null);

export function useUser() {
  const fetchUser = async () => {
    const {
      data: { user: currentUser },
      error,
    } = await supabase.auth.getUser();

    if (!error && currentUser) {
      user.value = currentUser;
    }
  };

  onMounted(fetchUser);

  return { user };
}
