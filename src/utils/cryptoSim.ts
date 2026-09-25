/**
 * Utility for End-to-End Encryption simulation & Web Crypto API for PGRI Ranting Sirnajaya 1
 */

// Mask sensitive NIK (Nomor Induk Kependudukan)
export const maskNIK = (nik: string, isPrivileged: boolean): string => {
  if (isPrivileged) return nik;
  if (!nik || nik.length < 8) return '••••••••••••••••';
  const clean = nik.split(' ')[0];
  if (clean.length >= 16) {
    return clean.substring(0, 4) + '••••••••' + clean.substring(12) + ' (Terenkripsi)';
  }
  return '••••••••' + clean.slice(-4) + ' (Terenkripsi)';
};

// Mask phone number
export const maskPhone = (phone: string, isPrivileged: boolean): string => {
  if (isPrivileged) return phone;
  if (!phone || phone.length < 6) return '••••••••••';
  return phone.substring(0, 4) + '••••' + phone.slice(-3);
};

// Mask email
export const maskEmail = (email: string, isPrivileged: boolean): string => {
  if (isPrivileged) return email;
  const parts = email.split('@');
  if (parts.length !== 2) return '••••••@••••';
  const name = parts[0];
  const maskedName = name.length > 3 ? name.substring(0, 2) + '•••' + name.slice(-1) : name.substring(0, 1) + '••';
  return `${maskedName}@${parts[1]}`;
};

// Generate SHA-256 checksum for audit & digital signature
export async function generateSHA256(content: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
  } catch (e) {
    // fallback if subtle crypto not accessible
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i);
      hash |= 0;
    }
    return 'PGRI-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }
}
