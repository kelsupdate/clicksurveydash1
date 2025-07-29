// Local referral service that works without external dependencies
export interface ReferralStats {
  total_referrals: number;
  completed_referrals: number;
  pending_referrals: number;
  total_earned: number;
  referral_code: string;
}

export interface Referral {
  id: string;
  referred_email: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  reward_amount: number;
}

// Generate a random referral code
export const generateReferralCode = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  
  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
};

// Get referral stats from localStorage
export const getReferralStats = (): ReferralStats => {
  const stored = localStorage.getItem('referralStats');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Create new stats if none exist
  const newStats: ReferralStats = {
    total_referrals: 0,
    completed_referrals: 0,
    pending_referrals: 0,
    total_earned: 0,
    referral_code: generateReferralCode()
  };
  
  localStorage.setItem('referralStats', JSON.stringify(newStats));
  return newStats;
};

// Update referral stats
export const updateReferralStats = (stats: ReferralStats): void => {
  localStorage.setItem('referralStats', JSON.stringify(stats));
};

// Get referrals from localStorage
export const getReferrals = (): Referral[] => {
  const stored = localStorage.getItem('referrals');
  return stored ? JSON.parse(stored) : [];
};

// Add a new referral
export const addReferral = (email: string): boolean => {
  const referrals = getReferrals();
  const stats = getReferralStats();
  
  // Check if email already exists
  if (referrals.some(r => r.referred_email === email)) {
    return false;
  }
  
  // Check daily limit (10 referrals max)
  const today = new Date().toISOString().split('T')[0];
  const todayReferrals = referrals.filter(r => 
    r.created_at.startsWith(today)
  ).length;
  
  if (todayReferrals >= 10) {
    return false;
  }
  
  const newReferral: Referral = {
    id: Date.now().toString(),
    referred_email: email,
    status: 'pending',
    created_at: new Date().toISOString(),
    reward_amount: 50
  };
  
  referrals.push(newReferral);
  localStorage.setItem('referrals', JSON.stringify(referrals));
  
  // Update stats
  stats.total_referrals += 1;
  stats.pending_referrals += 1;
  updateReferralStats(stats);
  
  return true;
};

// Complete a referral
export const completeReferral = (email: string): boolean => {
  const referrals = getReferrals();
  const stats = getReferralStats();
  
  const referralIndex = referrals.findIndex(r => 
    r.referred_email === email && r.status === 'pending'
  );
  
  if (referralIndex === -1) {
    return false;
  }
  
  referrals[referralIndex].status = 'completed';
  localStorage.setItem('referrals', JSON.stringify(referrals));
  
  // Update stats
  stats.completed_referrals += 1;
  stats.pending_referrals -= 1;
  stats.total_earned += 50;
  updateReferralStats(stats);
  
  return true;
};

// Reset referral data (for testing)
export const resetReferralData = (): void => {
  localStorage.removeItem('referralStats');
  localStorage.removeItem('referrals');
};
