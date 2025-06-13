// composables/useRewardClaim.ts
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

export async function claimReward(tier: number) {
  const auth = useAuthStore()
  const user = auth.user as { id: string } | null

  if (!user?.id) {
    console.error('No user session found.')
    return { success: false, error: 'User not authenticated' }
  }

  const rewardName =
    tier === 1 ? 'Sticker Pack' :
    tier === 2 ? 'Shirt' :
    tier === 3 ? 'Full Outfit' :
    'Unknown'

  const { error } = await supabase.from('reward_claims').insert({
    user_id: user.id,
    reward_tier: tier,
    reward_name: rewardName
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
