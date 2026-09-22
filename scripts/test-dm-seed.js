#!/usr/bin/env node
// Test script: create sample DM conversation
// Usage: node scripts/test-dm-seed.js

const { PrismaClient: CommunityClient } = require("../src/generated/community-client");
const { PrismaClient: AccountClient } = require("../src/generated/account-client");

async function main() {
  const communityDb = new CommunityClient();
  const accountDb = new AccountClient();

  try {
    // Get first 2 users from account DB
    const users = await accountDb.user.findMany({ take: 2 });
    
    if (users.length < 2) {
      console.log("⚠️  Need at least 2 users in account DB. Create users via /login first.");
      process.exit(1);
    }

    const [user1, user2] = users;
    console.log(`Creating DM between ${user1.email} and ${user2.email}...`);

    // Create conversation
    const conv = await communityDb.directConversation.create({
      data: {
        participants: {
          create: [
            { userId: user1.id },
            { userId: user2.id },
          ],
        },
        messages: {
          create: [
            {
              senderId: user1.id,
              content: "Halo! Gimana kabarmu?",
            },
            {
              senderId: user2.id,
              content: "Baik! Lagi sibuk belajar buat ujian. Kamu?",
            },
            {
              senderId: user1.id,
              content: "Sama, deadlines menumpuk 😅",
            },
          ],
        },
      },
    });

    console.log(`✓ Created conversation: ${conv.id}`);
    console.log(`✓ Added 3 messages`);
    console.log(`\nTest: Login as ${user1.email} or ${user2.email}, go to /community → Messages`);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await communityDb.$disconnect();
    await accountDb.$disconnect();
  }
}

main();
