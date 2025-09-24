
import fs from "fs";
import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportEmails() {
  try {
    console.log("🔍 Fetching users from Firestore...");
    const snapshot = await db.collection("users").get();
    let emails = [];

    console.log(`📊 Found ${snapshot.size} user documents`);

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });

    console.log(`📧 Extracted ${emails.length} email addresses`);

    // Create CSV format
    const csvContent = "email\n" + emails.join("\n");
    fs.writeFileSync("emails.csv", csvContent);

    // Create TXT format
    fs.writeFileSync("emails.txt", emails.join("\n"));

    console.log("✅ Export complete!");
    console.log("📁 Files created:");
    console.log("   - emails.csv");
    console.log("   - emails.txt");

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

exportEmails();
