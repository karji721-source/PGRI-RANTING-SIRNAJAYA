export interface WhatsAppMessageOptions {
  nama: string;
  npa: string;
  noHp: string;
  sekolah: string;
  bulan: string;
  nominal: number;
  tunggakanBulan?: number;
}

// Format phone number to Indonesian international format 62xxx
export const formatIndonesianPhone = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

export const generateTagihanIuranWAMessage = (options: WhatsAppMessageOptions): string => {
  const { nama, npa, sekolah, bulan, nominal, tunggakanBulan = 1 } = options;
  
  const totalTagihan = nominal * tunggakanBulan;
  
  const message = `*PEMBERITAHUAN IURAN RUTIN PGRI RANTING SIRNAJAYA*
Cab. Kecamatan Sukamakmur, Kabupaten Bogor

Kepada Yth.
*Bapak/Ibu ${nama}*
NPA PGRI: ${npa}
Unit Kerja: ${sekolah}

Assalamu'alaikum Wr. Wb. / Salam Sejahtera,
Semoga Bapak/Ibu senantiasa dalam keadaan sehat dan penuh berkah dalam menjalankan amanah mulia sebagai pendidik.

Melalui sistem informasi PGRI Ranting Sirnajaya (Cab. Sukamakmur, Kab. Bogor), kami menginformasikan perihal iuran rutin wajib anggota untuk periode *${bulan}*.

📌 *Rincian Tagihan:*
• Iuran Wajib Bulanan: Rp ${nominal.toLocaleString('id-ID')}
• Total Kewajiban (${tunggakanBulan} Bulan): *Rp ${totalTagihan.toLocaleString('id-ID')}*
• Status: *Belum Terkonfirmasi*

Pembayaran dapat disalurkan melalui:
1. Rekening Kas PGRI Ranting Sirnajaya:
   *Bank BJB*: 0123-4567-8901 a.n PGRI Ranting Sirnajaya
   *Bank BRI*: 4123-0100-2345-538 a.n Bendahara Ranting PGRI
2. Kas Tunai langsung kepada Bendahara (Ibu Hj. Ratna Dewi / SDN Sirnajaya 02)
3. Koordinator Iuran di masing-masing dari 6 SD Imbas

Setelah melakukan pembayaran, mohon konfirmasi melalui portal atau kirimkan bukti transfer ke Bendahara Ranting untuk penerbitan *Kwitansi Digital Resmi*.

Atas partisipasi, dedikasi, dan kebersamaan Bapak/Ibu dalam memajukan organisasi guru, kami ucapkan terima kasih.

_Hidup Guru! Hidup PGRI! Solidaritas Yes!_

*Pengurus PGRI Ranting Sirnajaya*
_Cab. Kecamatan Sukamakmur, Kab. Bogor_`;

  return message;
};

export const generateUndanganRapatWAMessage = (
  nama: string,
  judulRapat: string,
  tanggal: string,
  waktu: string,
  lokasi: string,
  linkOnline?: string
): string => {
  const message = `*UNDANGAN RESMI RAPAT PGRI RANTING SIRNAJAYA*
Cab. Kecamatan Sukamakmur, Kabupaten Bogor

Kepada Yth.
*Bapak/Ibu ${nama}*
Pengurus / Anggota PGRI Ranting Sirnajaya

Dengan hormat,
Mengharap kehadiran Bapak/Ibu dalam agenda rapat rutin organisasi:

📋 *Agenda:* ${judulRapat}
📅 *Hari/Tanggal:* ${tanggal}
⏰ *Waktu:* ${waktu}
📍 *Tempat:* ${lokasi}
${linkOnline ? `🌐 *Link Virtual (Hybrid):* ${linkOnline}` : ''}

Mengingat pentingnya agenda pembahasan ini demi kemaslahatan organisasi dan profesi guru di ranting kita, kehadiran tepat waktu sangat kami harapkan.

Mohon lakukan konfirmasi kehadiran (RSVP) melalui aplikasi sistem PGRI Ranting Sirnajaya.

Terima kasih atas perhatian dan kerja samanya.

*Pengurus PGRI Ranting Sirnajaya*
_Cab. Kecamatan Sukamakmur, Kab. Bogor_
_Ketua: Drs. H. Suryadi, M.Pd._
_Sekretaris: Ahmad Fauzi, S.Pd._`;

  return message;
};

export const getWhatsAppLink = (phone: string, text: string): string => {
  const formattedPhone = formatIndonesianPhone(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
};
