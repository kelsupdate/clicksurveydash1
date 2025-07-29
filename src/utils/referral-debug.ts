// Diagnostic script to debug referral page issues
export const debugReferralPage = () => {
  console.log('=== Referral Page Debug Info ===');
  
  // Check localStorage availability
  console.log('localStorage available:', typeof localStorage !== 'undefined');
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage working correctly');
  } catch (e) {
    console.error('localStorage error:', e);
  }
  
  // Check referral data
  console.log('referralStats in localStorage:', localStorage.getItem('referralStats'));
  console.log('referrals in localStorage:', localStorage.getItem('referrals'));
  
  // Check for parsing errors
  try {
    const stats = localStorage.getItem('referralStats');
    if (stats) JSON.parse(stats);
    console.log('referralStats JSON parsing: OK');
  } catch (e) {
    console.error('referralStats JSON parsing error:', e);
  }
  
  try {
    const referrals = localStorage.getItem('referrals');
    if (referrals) JSON.parse(referrals);
    console.log('referrals JSON parsing: OK');
  } catch (e) {
    console.error('referrals JSON parsing error:', e);
  }
  
  // Reset data if corrupted
  console.log('=== Reset Instructions ===');
  console.log('To reset referral data, run: localStorage.removeItem("referralStats"); localStorage.removeItem("referrals");');
};

// Run diagnostics
debugReferralPage();
