import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Referral system types
export interface Referral {
  id: string
  referrer_id: string
  referred_email: string
  referral_code: string
  status: 'pending' | 'completed' | 'expired'
  created_at: string
  completed_at?: string
  reward_amount: number
}

export interface UserReferralStats {
  total_referrals: number
  completed_referrals: number
  pending_referrals: number
  total_earned: number
  referral_code: string
}

// Referral system functions
export const generateReferralCode = (userId: string): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `${userId.substring(0, 4)}${timestamp}${random}`.toUpperCase()
}

// Create referral
export const createReferral = async (referrerId: string, email: string) => {
  const referralCode = generateReferralCode(referrerId)
  
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrerId,
      referred_email: email,
      referral_code: referralCode,
      reward_amount: 50,
      status: 'pending'
    })
    .select()
    .single()

  return { data, error }
}

// Get user referral stats
export const getUserReferralStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_referral_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

// Get user referrals
export const getUserReferrals = async (userId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Complete referral (called when referred user completes first survey)
export const completeReferral = async (referredEmail: string) => {
  try {
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_email', referredEmail)
      .eq('status', 'pending')
      .single()

    if (referral) {
      // Update referral status
      await supabase
        .from('referrals')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', referral.id)

      // Update user stats manually (if RPC not available)
      const { data: stats } = await supabase
        .from('user_referral_stats')
        .select('*')
        .eq('user_id', referral.referrer_id)
        .single()

      if (stats) {
        await supabase
          .from('user_referral_stats')
          .update({
            completed_referrals: stats.completed_referrals + 1,
            pending_referrals: stats.pending_referrals - 1,
            total_earned: stats.total_earned + referral.reward_amount
          })
          .eq('user_id', referral.referrer_id)
      }
    }
  } catch (error) {
    console.error('Error completing referral:', error)
  }
}

// Check daily referral limit
export const checkDailyReferralLimit = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0]
  
  const { count } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`)

  return (count || 0) < 10
}

// Backend referral validation
export const validateReferralCode = async (code: string): Promise<{
  valid: boolean
  message: string
  rewardAmount?: number
  referrerId?: string
}> => {
  try {
    const { data, error } = await supabase
      .from('user_referral_stats')
      .select('user_id, referral_code, total_earned')
      .eq('referral_code', code.toUpperCase())
      .single()
    
    if (error || !data) {
      return { valid: false, message: 'Invalid referral code' }
    }
    
    return { 
      valid: true, 
      message: 'Valid referral code applied! You will receive a bonus when you complete your first survey.',
      rewardAmount: 50,
      referrerId: data.user_id
    }
  } catch (error) {
    return { valid: false, message: 'Error validating referral code' }
  }
}

// Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
