#!/usr/bin/env node
/**
 * scripts/clean-and-seed-community.js
 * 
 * 1. Menghapus post test developer seperti "cek", "ngetes coba", "test" dari database Community production.
 * 2. Mengisi feed awal dengan 4 post representatif Gen Z wellness (breathing, sleep hygiene, self-compassion, jalan santai)
 *    lengkap dengan komentar hangat dan like.
 * 
 * Usage: node scripts/clean-and-seed-community.js
 */

const { PrismaClient: CommunityClient } = require("../src/generated/community-client");
const { PrismaClient: AccountClient } = require("../src/generated/account-client");

async function main() {
  const communityDb = new CommunityClient();
  const accountDb = new AccountClient();

  console.log("==> [1/3] Menghubungkan ke database...");

  try {
    // 1. Cari dan hapus post test sisa development
    const testKeywords = ["cek", "ngetes coba", "ngetes", "test", "tes", "testing", "coba cek"];
    
    // Cari post yang kontennya persis atau mengandung keyword test
    const allPosts = await communityDb.communityPost.findMany({
      select: { id: true, content: true }
    });

    const testPostIds = allPosts
      .filter((p) => {
        if (!p.content) return false;
        const normalized = p.content.toLowerCase().trim();
        return testKeywords.includes(normalized) || 
               normalized.startsWith("ngetes") || 
               normalized === "cek" || 
               (normalized.length <= 4 && (normalized.includes("cek") || normalized.includes("tes")));
      })
      .map((p) => p.id);

    if (testPostIds.length > 0) {
      console.log(`==> Menemukan ${testPostIds.length} post sampah/test untuk dihapus:`, testPostIds);
      
      // Hapus likes dan comments terkait
      await communityDb.communityLike.deleteMany({
        where: { postId: { in: testPostIds } }
      });
      await communityDb.communityComment.deleteMany({
        where: { postId: { in: testPostIds } }
      });
      await communityDb.communityPost.deleteMany({
        where: { id: { in: testPostIds } }
      });
      console.log("✅ Post test berhasil dibersihkan dari database!");
    } else {
      console.log("ℹ️  Tidak ditemukan post sampah/test di database.");
    }

    // 2. Pastikan akun demo/seed tersedia di Account DB
    console.log("==> [2/3] Memeriksa akun author di Account DB...");
    const SEED_USERS = [
      { email: "nadia@zyba.app", name: "Nadia Salsabila", avatarUrl: "fox" },
      { email: "kevin@zyba.app", name: "Kevin Mahendra", avatarUrl: "bear" },
      { email: "rania@zyba.app", name: "Rania Putri", avatarUrl: "koala" },
      { email: "fajar@zyba.app", name: "Fajar Hidayat", avatarUrl: "dog" },
      { email: "daffa@zyba.app", name: "Daffa Pratama", avatarUrl: "panda" },
      { email: "sarah@zyba.app", name: "Sarah Amalia", avatarUrl: "cat" },
    ];

    const userMap = new Map();
    for (const su of SEED_USERS) {
      const u = await accountDb.user.upsert({
        where: { email: su.email },
        update: { name: su.name, avatarUrl: su.avatarUrl },
        create: {
          email: su.email,
          passwordHash: "$2b$12$dummyDemoPasswordHashForCommunitySeedOnly1234567890",
          name: su.name,
          avatarUrl: su.avatarUrl,
          onboardingCompleted: true,
          plan: "FREE",
          zybaScore: 82,
        },
      });
      userMap.set(su.email, u);
    }

    // 3. Tambahkan 4 post representatif jika feed masih kosong atau kurang
    console.log("==> [3/3] Memeriksa konten feed representatif...");
    const existingCount = await communityDb.communityPost.count({
      where: { isHidden: false }
    });

    if (existingCount < 4) {
      console.log(`Feed memiliki ${existingCount} post. Menambahkan post representatif...`);

      const SAMPLE_POSTS = [
        {
          userEmail: "nadia@zyba.app",
          content: "Hari ke-5 rutin latihan box breathing 4-4-4-4 sebelum mulai ngerjain tugas akhir. Biasanya jam 2 siang udah kena brain fog & cemas parah, sekarang pikiran berasa jauh lebih stabil dan tenang. Buat teman-teman yang lagi banyak beban pikiran, jangan lupa tarik napas ya 🌱✨",
          comments: [
            { userEmail: "daffa@zyba.app", content: "Keren banget kak Nadia! Mau coba diterapin juga nih, belakangan ini gampang overthinking tiap buka laptop." },
            { userEmail: "nadia@zyba.app", content: "Semangat Daffa! Mulai dari 3 menit dulu aja, efeknya kerasa banget kok 🙌" }
          ],
          likesCount: 14,
        },
        {
          userEmail: "kevin@zyba.app",
          content: "Mencoba kurangi screen time 1 jam sebelum tidur selama seminggu ini. Tidur jadi jauh lebih pulas dan nggak kebangun di tengah malam. Hasil sleep efficiency di Zyba Score naik dari 65% ke 84%! Istirahat berkualitas beneran investasi terbaik buat produktivitas 💤",
          comments: [
            { userEmail: "sarah@zyba.app", content: "Wah congrats kak! Pengen banget bisa disiplin lepas HP sebelum tidur, selama ini sering scroll medsos sampe larut 😭" }
          ],
          likesCount: 21,
        },
        {
          userEmail: "rania@zyba.app",
          content: "Pengingat lembut untuk hari ini: Nggak apa-apa kalau energimu hari ini cuma sekadar bertahan hidup dan istirahat. Self-care bukan cuma liburan mahal, tapi juga kemampuan memberi izin pada diri sendiri untuk rehat tanpa rasa bersalah 🌿🤍",
          comments: [
            { userEmail: "fajar@zyba.app", content: "Pas banget lagi ngerasa bersalah seharian lemas. Makasih pengingatnya kak Rania 🥺" }
          ],
          likesCount: 32,
        },
        {
          userEmail: "fajar@zyba.app",
          content: "Sore ini jalan santai 30 menit keliling komplek sambil dengerin audio relaksasi Zyba. Terkadang solusi dari kepenatan kerja seharian cuma butuh gerak fisik ringan dan udara segar. Target aktivitas harian tercapai! 🚶‍♂️👟",
          comments: [
            { userEmail: "rania@zyba.app", content: "Jalan kaki sore emang paling ampuh buat reset mood!" }
          ],
          likesCount: 18,
        },
      ];

      for (const sp of SAMPLE_POSTS) {
        const author = userMap.get(sp.userEmail);
        if (!author) continue;

        const post = await communityDb.communityPost.create({
          data: {
            userId: author.id,
            content: sp.content,
            isHidden: false,
          },
        });

        // Add comments
        for (const sc of sp.comments) {
          const commenter = userMap.get(sc.userEmail);
          if (commenter) {
            await communityDb.communityComment.create({
              data: {
                postId: post.id,
                userId: commenter.id,
                content: sc.content,
              },
            });
          }
        }

        // Add likes
        for (const su of SEED_USERS.slice(0, Math.min(sp.likesCount, SEED_USERS.length))) {
          const liker = userMap.get(su.email);
          if (liker) {
            await communityDb.communityLike.upsert({
              where: { postId_userId: { postId: post.id, userId: liker.id } },
              update: {},
              create: { postId: post.id, userId: liker.id },
            });
          }
        }
      }

      console.log("✅ 4 post representatif Gen Z wellness berhasil ditambahkan ke feed!");
    } else {
      console.log(`✅ Feed sudah memiliki ${existingCount} post aktif yang memadai.`);
    }

    console.log("==> Selesai! Feed community bersih dan siap untuk demo / juri.");
  } catch (err) {
    console.error("❌ Error saat membersihkan/menge-seed community:", err);
  } finally {
    await communityDb.$disconnect().catch(() => {});
    await accountDb.$disconnect().catch(() => {});
  }
}

main();
