import { db } from "./db";
import bcrypt from "bcryptjs";
import { UserRole, Priority, CaseStatus, EvidenceType } from "@prisma/client";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create default users
    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = await Promise.all([
      db.user.upsert({
        where: { email: "admin@pngpolice.gov.pg" },
        update: {},
        create: {
          email: "admin@pngpolice.gov.pg",
          name: "System Administrator",
          password: hashedPassword,
          role: UserRole.ADMIN,
          department: "IT Department",
          phoneNumber: "+675 111 0001",
          isActive: true,
        },
      }),
      db.user.upsert({
        where: { email: "commander@pngpolice.gov.pg" },
        update: {},
        create: {
          email: "commander@pngpolice.gov.pg",
          name: "Inspector Mary Kate",
          password: hashedPassword,
          role: UserRole.UNIT_COMMANDER,
          department: "Cyber Crime Unit",
          phoneNumber: "+675 111 0002",
          isActive: true,
        },
      }),
      db.user.upsert({
        where: { email: "john.doe@pngpolice.gov.pg" },
        update: {},
        create: {
          email: "john.doe@pngpolice.gov.pg",
          name: "Det. John Doe",
          password: hashedPassword,
          role: UserRole.SENIOR_INVESTIGATOR,
          department: "Cyber Crime Unit",
          phoneNumber: "+675 111 0003",
          isActive: true,
        },
      }),
      db.user.upsert({
        where: { email: "sarah.wilson@pngpolice.gov.pg" },
        update: {},
        create: {
          email: "sarah.wilson@pngpolice.gov.pg",
          name: "Det. Sarah Wilson",
          password: hashedPassword,
          role: UserRole.INVESTIGATOR,
          department: "Cyber Crime Unit",
          phoneNumber: "+675 111 0004",
          isActive: true,
        },
      }),
      db.user.upsert({
        where: { email: "mike.johnson@pngpolice.gov.pg" },
        update: {},
        create: {
          email: "mike.johnson@pngpolice.gov.pg",
          name: "Sgt. Mike Johnson",
          password: hashedPassword,
          role: UserRole.ANALYST,
          department: "Digital Forensics",
          phoneNumber: "+675 111 0005",
          isActive: true,
        },
      }),
    ]);

    console.log("✅ Created default users");

    // Create offense categories
    const offenseCategories = await Promise.all([
      db.offenseCategory.upsert({
        where: { name: "Romance Scam" },
        update: {},
        create: {
          name: "Romance Scam",
          category: "Online Fraud",
          severity: "High",
          description: "Fraudulent romantic relationships established online to extract money from victims",
          commonSigns: [
            "Claims to be deployed military personnel",
            "Requests money for emergency leave",
            "Uses stolen military photos",
            "Avoids video calls or phone calls"
          ],
          redFlags: [
            "Immediate declarations of love",
            "Requests for money or gift cards",
            "Inconsistent stories about deployment",
            "Professional quality photos"
          ],
          investigationTips: [
            "Reverse image search profile photos",
            "Check military deployment databases",
            "Analyze communication patterns",
            "Trace financial transactions"
          ],
          preventionAdvice: [
            "Never send money to someone you've only met online",
            "Be wary of immediate romantic declarations",
            "Verify identity through video calls"
          ],
          commonPlatforms: ["Facebook", "Instagram", "Dating Apps"],
          targetDemographics: ["Women 35-65", "Recently divorced", "Lonely individuals"],
          investigationComplexity: "High",
          legalFramework: "Criminal Code Act - Fraud provisions",
          casesThisYear: 34,
          trend: "increasing",
          averageLoss: "K25,000",
        },
      }),
      db.offenseCategory.upsert({
        where: { name: "Investment Fraud" },
        update: {},
        create: {
          name: "Investment Fraud",
          category: "Financial Fraud",
          severity: "High",
          description: "Fraudulent investment schemes promising high returns",
          commonSigns: [
            "Guaranteed high returns with no risk",
            "Pressure to invest quickly",
            "Fake trading interfaces",
            "Difficulty withdrawing funds"
          ],
          redFlags: [
            "Unregulated investment platforms",
            "Promises of unrealistic returns",
            "Requests for additional fees to withdraw"
          ],
          investigationTips: [
            "Check business registration and licensing",
            "Analyze website creation dates",
            "Track cryptocurrency wallet addresses"
          ],
          preventionAdvice: [
            "Only use licensed platforms",
            "Research investments thoroughly",
            "Be skeptical of guaranteed returns"
          ],
          commonPlatforms: ["Facebook", "Instagram", "WhatsApp", "Telegram"],
          targetDemographics: ["Young adults", "Tech-savvy individuals"],
          investigationComplexity: "High",
          legalFramework: "Securities Act, Criminal Code",
          casesThisYear: 19,
          trend: "increasing",
          averageLoss: "K45,000",
        },
      }),
    ]);

    console.log("✅ Created offense categories");

    // Create sample cases
    const sampleCases = await Promise.all([
      db.cyberCase.upsert({
        where: { caseId: "CYBER-2024-001" },
        update: {},
        create: {
          caseId: "CYBER-2024-001",
          title: "Online Romance Scam - Maria Santos",
          description: "Victim reported being defrauded by someone claiming to be US military personnel deployed overseas. Victim sent approximately K15,000 in gift cards and bank transfers.",
          offenseType: "Romance Scam",
          priority: Priority.HIGH,
          status: CaseStatus.IN_PROGRESS,
          incidentDate: new Date("2024-01-01"),
          reportedDate: new Date("2024-01-02"),
          location: "Port Moresby, NCD",
          estimatedLoss: 15000,
          currency: "PGK",
          createdById: users[2].id, // John Doe
          assignedToId: users[3].id, // Sarah Wilson
        },
      }),
      db.cyberCase.upsert({
        where: { caseId: "CYBER-2024-002" },
        update: {},
        create: {
          caseId: "CYBER-2024-002",
          title: "Cryptocurrency Investment Fraud",
          description: "Multiple victims reported losing money through fake cryptocurrency trading platform. Platform promised guaranteed 30% returns but victims unable to withdraw funds.",
          offenseType: "Investment Fraud",
          priority: Priority.HIGH,
          status: CaseStatus.UNDER_INVESTIGATION,
          incidentDate: new Date("2024-01-03"),
          reportedDate: new Date("2024-01-04"),
          location: "Lae, Morobe Province",
          estimatedLoss: 45000,
          currency: "PGK",
          createdById: users[2].id,
          assignedToId: users[2].id,
        },
      }),
    ]);

    console.log("✅ Created sample cases");

    // Create sample victims
    await Promise.all([
      db.victim.create({
        data: {
          name: "Maria Santos",
          age: 42,
          gender: "FEMALE",
          phoneNumber: "+675 7123 4567",
          email: "maria.santos@email.com",
          address: "Section 4, Port Moresby, NCD",
          occupation: "Teacher",
          vulnerabilities: "Recently divorced, seeking companionship online",
          needsSupport: true,
          contactPreference: "phone",
          contactInfo: "Phone: +675 7123 4567, Email: maria.santos@email.com",
          cases: {
            connect: { id: sampleCases[0].id }
          }
        },
      }),
      db.victim.create({
        data: {
          name: "Peter Kila",
          age: 28,
          gender: "MALE",
          phoneNumber: "+675 7234 5678",
          email: "peter.kila@email.com",
          address: "Top Town, Lae, Morobe Province",
          occupation: "Business Owner",
          vulnerabilities: "Looking for investment opportunities",
          needsSupport: false,
          contactPreference: "email",
          contactInfo: "Phone: +675 7234 5678, Email: peter.kila@email.com",
          cases: {
            connect: { id: sampleCases[1].id }
          }
        },
      }),
    ]);

    console.log("✅ Created sample victims");

    // Create sample suspects
    await Promise.all([
      db.suspect.create({
        data: {
          name: "Unknown (Military Alias)",
          alias: "Staff Sergeant Michael Thompson",
          gender: "MALE",
          notes: "Uses multiple fake military profiles across different platforms. Facebook: Michael Thompson (fake profile)",
          address: "Unknown (claims to be in Afghanistan)",
          description: "Uses stolen photos of military personnel",
          cases: {
            connect: { id: sampleCases[0].id }
          }
        },
      }),
    ]);

    console.log("✅ Created sample suspects");

    // Create knowledge articles
    await Promise.all([
      db.knowledgeBaseArticle.create({
        data: {
          title: "Romance Scam Investigation Guide",
          category: "Romance Scams",
          content: "Comprehensive guide for investigating romance scams including evidence collection, victim interview techniques, and international cooperation...",
          tags: ["romance-scam", "investigation", "best-practices"],
        },
      }),
      db.knowledgeBaseArticle.create({
        data: {
          title: "Current Threat Advisory: TikTok Investment Scams",
          category: "Investment Fraud",
          content: "Recent intelligence indicates increasing use of TikTok to promote fraudulent investment schemes targeting young Papua New Guineans...",
          tags: ["tiktok", "investment-fraud", "advisory", "social-media"],
        },
      }),
    ]);

    console.log("✅ Created knowledge articles");

    // Create initial notifications
    await Promise.all([
      db.notification.create({
        data: {
          userId: users[3].id, // Sarah Wilson
          caseId: sampleCases[0].id,
          type: "CASE_ASSIGNED",
          title: "New Case Assigned",
          message: "You have been assigned to case CYBER-2024-001: Online Romance Scam - Maria Santos",
          priority: "URGENT",
        },
      }),
      db.notification.create({
        data: {
          userId: users[2].id, // John Doe
          type: "SYSTEM_NOTIFICATION",
          title: "System Update",
          message: "Cyber Crime Monitoring System has been updated with new features",
        },
      }),
    ]);

    console.log("✅ Created sample notifications");

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("Admin: admin@pngpolice.gov.pg / password123");
    console.log("Commander: commander@pngpolice.gov.pg / password123");
    console.log("Senior Investigator: john.doe@pngpolice.gov.pg / password123");
    console.log("Investigator: sarah.wilson@pngpolice.gov.pg / password123");
    console.log("Analyst: mike.johnson@pngpolice.gov.pg / password123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
