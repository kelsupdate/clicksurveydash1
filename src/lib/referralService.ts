import { supabase } from './supabaseClient';

export interface ReferralData {
  referrerId: string;
  referredEmail: string;
  referralCode: string;
  rewardAmount?: number;
}

export class ReferralService {
  /**
   * Process referral code after user signup
   */
  static async processReferralCode(userId: string, email: string, referralCode?: string): Promise<void> {
    if (!referralCode) return;

    try {
      // Validate referral code exists
      const { data: referrerData, error: referrerError } = await supabase
        .from('user_referral_stats')
        .select('user_id')
        .eq('referral_code', referralCode)
        .single();

      if (referrerError || !referrerData) {
        console.warn('Invalid referral code:', referralCode);
        return;
      }

      // Check if email already referred
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_email', email)
        .single();

      if (existingReferral) {
        console.log('Email already referred:', email);
        return;
      }

      // Create referral record
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerData.user_id,
          referred_email: email,
          referral_code: referralCode,
          reward_amount: 50,
          status: 'pending'
        });

      if (insertError) {
        console.error('Error creating referral:', insertError);
        return;
      }

      // Update referrer stats
      await supabase
        .from('user_referral_stats')
        .update({ 
          total_referrals: supabase.sql`total_referrals + 1`,
          pending_referrals: supabase.sql`pending_referrals + 1`
        })
        .eq('user_id', referrerData.user_id);

      console.log('Referral processed successfully:', { userId: userId, referralCode });
    } catch (error) {
      console.error('Error processing referral:', error);
    }
  }

  /**
   * Get user's referral stats
   */
  static async getReferralStats(userId: string) {
    const { data, error } = await supabase
      .from('user_referral_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting referral stats:', error);
      return null;
    }

    return data;
  }

  /**
   * Get user's referrals
   */
  static async getReferrals(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting referrals:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Check if user can send more referrals today
   */
  static async canSendMoreReferrals(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    return (count || 0) < 10;
  }
}
