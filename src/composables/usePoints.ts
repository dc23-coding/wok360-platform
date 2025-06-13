// composables/usePoints.ts
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

export async function addGamePoints(amount: number) {
  const auth = useAuthStore()
  const user = auth.user as { id: string } | null

  if (!user?.id) return

  const { data, error } = await supabase.rpc('increment_game_points', {
    uid: user.id,
    add_points: amount
  })

  if (error) console.error('Points error:', error)
  return data
}
