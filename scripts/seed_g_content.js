const { PrismaClient } = require('../src/generated/account-client');
const prisma = new PrismaClient();

// 1. DATA BADGES (Sesuai G.3, Ikon Lucide resmi, Teks Bahasa Indonesia)
const BADGES_DATA = [
  {
    key: "first_mood",
    name: "Mood Pertama",
    description: "Menyelesaikan check-in suasana hati atau asesmen pertama kali.",
    category: "Wellness",
    icon: "Heart",
    xpReward: 15,
  },
  {
    key: "streak_3",
    name: "3 Hari Berturut-turut",
    description: "Konsisten merawat kesehatan mental selama 3 hari tanpa jeda.",
    category: "Streak",
    icon: "Flame",
    xpReward: 30,
  },
  {
    key: "first_companion",
    name: "Sapa ZYBA",
    description: "Memulai percakapan curhat pertama kali dengan AI Companion ZYBA.",
    category: "Companion",
    icon: "MessageSquare",
    xpReward: 15,
  },
  {
    key: "first_community",
    name: "Penulis Pertama",
    description: "Membagikan cerita atau refleksi pertama di Zyba Community.",
    category: "Sosial",
    icon: "Users",
    xpReward: 20,
  },
  {
    key: "journal_10",
    name: "10 Catatan Jiwa",
    description: "Menuliskan 10 refleksi mendalam di jurnal pribadi ZYBA.",
    category: "Wellness",
    icon: "BookOpen",
    xpReward: 50,
  },
  {
    key: "first_breathing",
    name: "Napas Tenang",
    description: "Menyelesaikan sesi latihan pernapasan Zyba Hours untuk meredakan stres.",
    category: "Aktivitas",
    icon: "Wind",
    xpReward: 20,
  },
  {
    key: "streak_7",
    name: "Semangat Sepekan",
    description: "Mempertahankan rutinitas wellness selama 7 hari berturut-turut.",
    category: "Streak",
    icon: "Zap",
    xpReward: 75,
  },
  {
    key: "activity_first",
    name: "Langkah Awal",
    description: "Menyelesaikan target aktivitas fisik harian pertama kali.",
    category: "Aktivitas",
    icon: "Activity",
    xpReward: 20,
  },
  {
    key: "deep_zen",
    name: "Ketenangan Jiwa",
    description: "Menyelesaikan 5 sesi pernapasan Zyba Hours dengan alunan musik latar.",
    category: "Aktivitas",
    icon: "Sparkles",
    xpReward: 40,
  },
];

// 2. DATA 6 ARTIKEL (400 - 700 KATA, SITUASI KONKRET GEN Z INDONESIA, ANTI-AI-SLOP)
const ARTICLES_DATA = [
  {
    type: "ARTICLE",
    title: "Cara Mengelola Stres Akademik Tanpa Burnout",
    author: "Tim Psikologi Zyba Wellness",
    durationMin: 5,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    body: `Bagi mahasiswa atau pelajar Gen Z di Indonesia, siklus akademik sering kali terasa seperti maraton tanpa garis akhir. Deadline tugas kelompok yang menumpuk di Google Classroom, revisi bab skripsi yang tak kunjung di-acc dosen pembimbing, hingga tuntutan magang demi resume yang 'mentereng' di LinkedIn. Banyak dari kita yang merasa bersalah saat beristirahat 15 menit saja, seolah-olah rehat sejenak adalah tanda kemalasan. Akibatnya, kita terjebak dalam kondisi *academic burnout*: tubuh duduk di depan laptop membuka dokumen, tetapi otak terasa berkabut dan tidak mampu memproses satu kalimat pun.

Kunci utama mengelola stres akademik bukanlah menambah jam belajar hingga dini hari sambil menenggak kopi instan, melainkan mengganti sistem kerja kita dari *endless to-do list* menjadi teknik *time-blocking* yang realistis. Daftar to-do list biasa cenderung memicu kecemasan karena memberi ilusi bahwa semua hal harus diselesaikan hari ini juga. Sebaliknya, cobalah membagi hari ke dalam blok waktu spesifik: misalnya, 09.00–11.00 khusus untuk mencari 3 jurnal referensi, dilanjutkan blok istirahat penuh tanpa menyentuh materi kuliah.

Selain itu, adaptasikan teknik Pomodoro sesuai ritme energimu. Daripada memaksakan 25 menit yang kerap terputus saat ide sedang mengalir, gunakan ritme 50 menit fokus tanpa membuka notifikasi WhatsApp Web atau TikTok, diikuti 10 menit istirahat fisik. Perhatikan: istirahat produktif bukanlah berganti layar dari laptop ke layar ponsel untuk *doomscrolling*, melainkan berdiri, mencuci muka, minum air putih dingin, atau melakukan peregangan bahu yang kaku.

Kenalilah tanda-tanda awal burnout sebelum terlambat: perasaan sinis terhadap mata kuliah yang biasanya kamu sukai, rasa lelah luar biasa saat bangun pagi meskipun sudah tidur 8 jam, dan hilangnya kepuasan saat menyelesaikan tugas. Sadarilah bahwa istirahat terencana adalah bahan bakar kinerja otak, bukan hadiah yang hanya boleh dinikmati setelah tubuhmu tumbang. Belajar menjaga batasan diri adalah bagian penting dari kedewasaan akademismu.`
  },
  {
    type: "ARTICLE",
    title: "Sleep Hygiene: Kenapa Begadang Bikin Makin Cemas",
    author: "Tim Zyba Wellness & Sleep Science",
    durationMin: 5,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    body: `Pernahkah kamu berniat tidur jam 11 malam, tetapi mendapati dirimu masih asyik membuka FYP TikTok atau membalas chat di kamar kos yang gelap gulita hingga pukul 2 pagi? Keesokan harinya, kamu tidak hanya merasa mengantuk, tetapi dada terasa lebih berdebar, overthinking hal-hal sepele, dan mudah tersinggung oleh komentar teman. Ini bukan sekadar sugesti atau rasa lelah biasa; ini adalah respons biologis nyata antara jam biologis tidur dan sistem sarafmu.

Saat tubuh kekurangan tidur atau jadwal tidur berantakan, amigdala—bagian otak yang bertugas memproses rasa takut dan emosi—menjadi hiperaktif hingga 60% lebih reaktif. Di saat yang sama, kadar hormon stres (kortisol) melonjak tinggi karena otak mengira tubuh sedang berada dalam kondisi bahaya. Yang mengejutkan, riset kronobiologi membuktikan bahwa konsistensi jam tidur dan jam bangun jauh lebih krusial bagi kestabilan emosi daripada total jam tidur semata. Tidur jam 3 pagi dan bangun jam 11 siang di akhir pekan (sering disebut *social jetlag*) justru merusak ritme sirkadian dan memicu 'Sunday Night Blues' yang mencekam.

Musuh terbesar tidur berkualitas di era modern adalah *dopamine loop* dari layar smartphone. Cahaya biru (blue light) menekan produksi hormon melatonin alami tubuh, sementara konten video singkat berkecepatan tinggi merangsang otak untuk terus terjaga mencari kepuasan instan berikutnya. Untuk mengatasinya, terapkan aturan *wind-down routine* 30 menit sebelum tidur:
1. Pindahkan pengisian daya ponsel ke meja yang berjarak minimal 2 meter dari kasurmu, bukan di samping bantal.
2. Redupkan lampu kamar atau nyalakan lampu tidur berwarna kuning hangat (*warm light*).
3. Ganti aktivitas scrolling dengan membaca buku fisik, mendengarkan musik ambient santai, atau mencatat daftar pikiran yang mengganggu di jurnal.

Memberi tubuhmu kepastian waktu tidur adalah cara paling murah dan efektif untuk menyembuhkan kecemasan harian.`
  },
  {
    type: "ARTICLE",
    title: "Teknik Grounding 5-4-3-2-1 untuk Meredakan Kecemasan Mendadak",
    author: "dr. Amanda Lee, Sp.KJ & Tim ZYBA",
    durationMin: 4,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
    body: `Kecemasan mendadak atau *panic rush* kerap datang tanpa aba-aba: saat giliranmu berbicara di depan kelas atau ruang rapat presentasi, saat membaca pesan singkat yang tidak menyenangkan dari atasan magang, atau ketika terjebak kemacetan di KRL/TransJakarta yang sesak. Jantungmu mulai berdegup kencang, napas terasa pendek di tenggorokan, dan pikiran melesat membayangkan skenario terburuk yang belum tentu terjadi.

Dalam kondisi seperti ini, mencoba menasihati diri sendiri dengan kalimat klise seperti "santai saja, jangan panik" sering kali tidak mempan, karena amigdala sedang membajak fungsi logika otak. Cara tercepat untuk menghentikan kepanikan adalah dengan *grounding sensorik*—memaksa otak kembali berpijak pada realitas fisik saat ini melalui panca indera dengan metode **5-4-3-2-1**:

1. **5 Hal yang Bisa Kamu Lihat**: Perhatikan sekitarmu dan sebutkan 5 objek secara spesifik. Misalnya: serat kayu di permukaan meja, retakan kecil di dinding, pulpen biru di dekat laptop, lampu indikator router, atau pola kemeja teman di depanmu.
2. **4 Hal yang Bisa Kamu Sentuh**: Rasakan sensasi fisik nyata pada tubuhmu. Rasakan telapak kakimu yang menapak mantap di lantai, gesekan kain celana di paha, dinginnya cincin logam di jarimu, atau hembusan angin pendingin ruangan di kulit tanganmu.
3. **3 Suara yang Bisa Kamu Dengar**: Tutup mata sejenak dan dengarkan bunyi latar. Suara dengung AC, deru kendaraan sayup-sayup di kejauhan, atau suara tarikan napasmu sendiri.
4. **2 Aroma yang Bisa Kamu Cium**: Tarik napas perlahan dan cari aroma di sekitarmu, seperti aroma parfum di bajumu, bau kopi di cangkir, atau aroma minyak angin aromaterapi.
5. **1 Rasa yang Ada di Lidah**: Rasakan sisa rasa air mineral, mint dari permen karet, atau sekadar basahi bibirmu.

Padukan latihan grounding ini dengan fitur **Zyba Hours (Breathing Exercise)**. Saat kamu menarik napas dalam selama 4 detik dan mengembuskannya perlahan, sistem saraf parasimpatis akan aktif, mengirimkan sinyal tegas ke seluruh tubuh: "Kamu sedang aman di sini saat ini."`
  },
  {
    type: "ARTICLE",
    title: "Kapan Harus Cari Bantuan Profesional, Bukan Cuma Curhat ke Teman",
    author: "Rian Suryadi, M.Psi & Tim Psikolog ZYBA",
    durationMin: 6,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80",
    body: `Punya sahabat dekat yang mau diajak nongkrong di *coffee shop* sambil mendengarkan keluh kesah asmara atau curhat soal pekerjaan adalah berkah luar biasa. Namun, ada batas tipis antara kebutuhan curhat biasa dengan kondisi klinis yang menuntut penanganan tenaga profesional kesehatan mental. Menggantungkan seluruh beban trauma masa lalu atau kecemasan kronis kepada teman sebaya bukan hanya tidak menyelesaikan akar masalah, tetapi juga berisiko menimbulkan *compassion fatigue* pada hubungan pertemanan kalian.

Lantas, bagaimana membedakan rasa sedih wajar akibat dinamika hidup sehari-hari dengan kondisi yang memerlukan psikolog atau psikiater? Pertimbangkan rumus **DID (Durasi, Intensitas, Disfungsi)**:
- **Durasi**: Perasaan sedih, hampa, atau cemas berlangsung hampir setiap hari selama lebih dari dua minggu berturut-turut tanpa pemicu yang jelas.
- **Intensitas**: Pikiran negatif terasa begitu luar biasa hingga memicu gejala fisik seperti sakit kepala tegang tanpa sebab medis, gangguan asam lambung kronis, hingga insomnia parah.
- **Disfungsi Harian**: Kondisi mentalmu sudah mulai melumpuhkan fungsi hidup dasar—kamu mangkir kuliah berminggu-minggu, tidak mampu mandi atau merawat diri, mengisolasi diri dari interaksi sosial, atau mulai muncul dorongan menyakiti diri sendiri.

Banyak Gen Z Indonesia yang ragu mencari bantuan karena mitos bahwa terapi itu mahal atau hanya untuk orang yang "gila". Faktanya, saat ini akses kesehatan mental di Indonesia sudah jauh lebih inklusif dan terjangkau:
1. **Layanan BPJS Kesehatan**: Kamu bisa mendatangi Faskes Tingkat 1 (Puskesmas) untuk meminta rujukan ke Poli Jiwa di RSUD terdekat secara gratis tanpa dipungut biaya.
2. **Puskesmas dengan Layanan Psikolog Klinis**: Khususnya di kota-kota besar seperti Jakarta, Surabaya, Yogyakarta, dan Bandung, banyak Puskesmas yang memiliki psikolog klinis dengan tarif retribusi sangat murah (berkisar Rp10.000–Rp30.000 per sesi).
3. **Pusat Konseling Kampus**: Manfaatkan layanan konseling mahasiswa yang disediakan gratis oleh universitasmu.

Meminta bantuan profesional bukanlah tanda kelemahan, melainkan bukti keberanian untuk bertanggung jawab atas kesehatan dirimu seutuhnya.`
  },
  {
    type: "ARTICLE",
    title: "Journaling: Bukan Cuma Nulis Diary, Ini Manfaat Nyatanya",
    author: "Tim Riset Klinis Zyba Wellness",
    durationMin: 5,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80",
    body: `Mendengar kata journaling, mungkin hal pertama yang terlintas di benakmu adalah buku harian masa SMP bergembok kecil dengan tulisan curahan hati tentang gebetan. Stigma bahwa journaling itu 'menye-menye' membuat banyak orang enggan mencobanya. Padahal, dalam dunia psikologi kognitif, teknik *expressive writing* yang dipelopori oleh Dr. James Pennebaker telah terbukti secara ilmiah mampu menurunkan hormon kortisol, memperkuat sistem kekebalan tubuh, dan meredakan kepenatan mental.

Ketika pikiran cemas berputar di kepala tanpa diungkapkan, otak kita bekerja seperti laptop dengan 50 tab browser terbuka sekaligus: memori RAM penuh, sistem melambat, dan baterai cepat terkuras. Menuliskan isi kepala ke dalam bentuk tulisan berfungsi seperti tombol *download*: kita memindahkan beban kognitif dari memori internal ke media eksternal, sehingga kita bisa melihat masalah secara lebih objektif dan berjarak.

Bagi kamu yang malas menulis kalimat panjang atau merasa kehabisan kata-kata, jangan khawatir. Journaling tidak harus puitis atau berlembar-lembar. Cobalah metode **Bullet Journaling Emosi** yang sangat cocok untuk Gen Z:
- **Tiga Kata Cuaca Batin**: Tuliskan 3 kata sifat yang menggambarkan perasaanmu saat ini (misalnya: *bingung, lelah, lapar*).
- **Brain Dump 3 Menit**: Pasang alarm selama 3 menit di ponsel, lalu tulis apa pun yang terlintas di kepalamu tanpa memikirkan ejaan, tanda baca, atau kerapian tulisan. Jangan diedit.
- **Satu Hal yang Berada di Bawah Kendaliku**: Tuliskan satu langkah kecil konkret yang bisa kamu lakukan hari ini untuk masalah tersebut.

Fitur **Health Journal** di ZYBA dirancang khusus untuk memfasilitasi kebiasaan ini secara privat dan aman. Catat suasana hatimu, tumpahkan bebanmu, dan rasakan kelegaan saat pikiranmu mulai terurai satu per satu.`
  },
  {
    type: "ARTICLE",
    title: "Overthinking vs Reflektif: Cara Bedain dan Cara Berhenti",
    author: "Tim Edukasi Psikologi ZYBA",
    durationMin: 5,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80",
    body: `"Gimana kalau pas wawancara kerja nanti aku nge-blank?", "Kenapa ya chat-ku cuma di-read padahal dia online?", "Dulu kenapa aku sebodoh itu ngomong gitu di depan banyak orang?". Pikiran-pikiran seperti ini sering kali datang saat malam menjelang tidur, memutar rekaman masa lalu atau skenario masa depan yang suram berulang kali. Banyak orang membela diri dengan dalih: "Aku bukan overthinking kok, aku cuma lagi refleksi diri dan berpikir kritis."

Namun, ada perbedaan mendasar antara **berpikir reflektif** dengan **overthinking (ruminasi)**:
- **Refleksi Diri**: Berorientasi pada solusi, memiliki batasan waktu yang jelas, membantu kita belajar dari kesalahan, dan menghasilkan perasaan lega atau rencana aksi konkret. Contoh: *"Kemarin ujianku nilainya kurang karena aku belajar sistem kebut semalam. Mulai minggu depan aku akan buat jadwal belajar 30 menit tiap sore."*
- **Overthinking**: Berputar-putar tanpa henti (*looping*), berfokus pada pertanyaan "kenapa ini terjadi padaku?" tanpa solusi, menguras energi emosional, dan melumpuhkan inisiatif untuk bertindak (*analysis paralysis*).

Jika kamu sedang terjebak dalam lingkaran overthinking, gunakan dua teknik ampuh dari pendekatan CBT (*Cognitive Behavioral Therapy*):

1. **Teknik 'Worry Window' (Jendela Khusus Khawatir)**: Tetapkan waktu khusus selama 15 menit setiap hari (misalnya pukul 16.30–16.45) khusus untuk memikirkan semua kekhawatiranmu. Jika ada pikiran cemas muncul di luar jam tersebut—misalnya saat jam kerja atau sebelum tidur—katakan pada dirimu: *"Aku sudah catat ini, dan aku baru boleh memikirkannya di jam 16.30 nanti."* Kamu akan terkejut melihat betapa banyak kekhawatiran yang sudah kehilangan kekuatannya saat jam itu tiba.
2. **Cognitive Defusion**: Sadarilah bahwa pikiranmu bukanlah fakta mutlak. Ubah kalimat dari *"Aku pasti gagal dan mempermalukan diri"* menjadi *"Aku menyadari bahwa pikiranku sedang memunculkan cerita tentang kegagalan."* Jarak bahasa sederhana ini membebaskanmu dari cengkeraman emosi cemas.

Berhenti membedah setiap detail yang tidak bisa kamu kendalikan. Tarik napas, kembali ke saat ini, dan fokuslah pada langkah kecil yang bisa kamu ambil detik ini.`
  }
];

// 3. DATA AUDIO TRACKS (Kategori Ambient, Relaxation, Sleep sesuai G.1)
const AUDIO_RESOURCES_DATA = [
  {
    type: "AUDIO",
    title: "Alunan Pernapasan Tenang (Placid Ambient)",
    author: "MusicLFiles (ElevenLabs Collection)",
    durationMin: 3,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80",
    audioUrl: "/audio/relaxation-breathe.ogg",
    body: "Instrumen ambient lembut dengan gelombang nada menenangkan untuk meredakan ketegangan otot dan menemani sesi pernapasan Zyba Hours."
  },
  {
    type: "AUDIO",
    title: "Fokus & Belajar Damai (Spiritual Ambient)",
    author: "MusicLFiles (ElevenLabs Collection)",
    durationMin: 4,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    audioUrl: "/audio/ambient-focus.ogg",
    body: "Harmoni synth pad hangat berfrekuensi rendah untuk meningkatkan konsentrasi belajar, time-blocking, atau deep work tanpa distraksi."
  },
  {
    type: "AUDIO",
    title: "Meditasi Tidur Lelap (Monday Meditation)",
    author: "Wayne Kinos (ElevenLabs Collection)",
    durationMin: 6,
    isPro: false,
    coverUrl: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80",
    audioUrl: "/audio/deep-sleep.ogg",
    body: "Gelombang suara santai yang membawa pikiran dari frekuensi beta menuju alpha dan theta untuk mengantarkan tidur lelap bebas insomnia."
  }
];

async function seed() {
  console.log("Seeding Badges...");
  for (const b of BADGES_DATA) {
    await prisma.badge.upsert({
      where: { key: b.key },
      update: {
        name: b.name,
        description: b.description,
        category: b.category,
        icon: b.icon,
        xpReward: b.xpReward,
      },
      create: {
        key: b.key,
        name: b.name,
        description: b.description,
        category: b.category,
        icon: b.icon,
        xpReward: b.xpReward,
      },
    });
  }
  console.log(`Successfully seeded ${BADGES_DATA.length} badges.`);

  console.log("Seeding Articles & Audio Resources...");
  for (const art of ARTICLES_DATA) {
    const existing = await prisma.resource.findFirst({
      where: { title: art.title },
    });
    if (existing) {
      await prisma.resource.update({
        where: { id: existing.id },
        data: art,
      });
    } else {
      await prisma.resource.create({
        data: art,
      });
    }
  }
  console.log(`Successfully seeded ${ARTICLES_DATA.length} articles.`);

  for (const aud of AUDIO_RESOURCES_DATA) {
    const existing = await prisma.resource.findFirst({
      where: { title: aud.title },
    });
    if (existing) {
      await prisma.resource.update({
        where: { id: existing.id },
        data: aud,
      });
    } else {
      await prisma.resource.create({
        data: aud,
      });
    }
  }
  console.log(`Successfully seeded ${AUDIO_RESOURCES_DATA.length} audio resources.`);
}

seed()
  .then(() => {
    console.log("All content successfully seeded to Account DB!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
