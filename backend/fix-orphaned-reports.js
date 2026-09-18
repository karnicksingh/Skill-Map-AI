/**
 * One-time migration script.
 * Run: node fix-orphaned-reports.js
 *
 * Finds all InterviewReport documents where user is null/undefined
 * and sets them to the given userId.
 *
 * Usage:
 *   node fix-orphaned-reports.js <userId>
 *
 * Example:
 *   node fix-orphaned-reports.js 6aa18afc3d80a019b2f681df
 */

require("dotenv").config();
const mongoose = require("mongoose");
const interviewReportModel = require("./models/interviewReport.model.js");

const userId = process.argv[2];

if (!userId) {
    console.error("Usage: node fix-orphaned-reports.js <userId>");
    console.error("Example: node fix-orphaned-reports.js 6aa18afc3d80a019b2f681df");
    process.exit(1);
}

async function run() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Find all reports with no user
    const orphaned = await interviewReportModel.find({
        $or: [{ user: null }, { user: { $exists: false } }]
    }).select("_id jobTitle createdAt");

    console.log(`Found ${orphaned.length} orphaned report(s):`);
    orphaned.forEach(r => {
        console.log(`  - ${r._id}  |  ${r.jobTitle}  |  ${r.createdAt}`);
    });

    if (orphaned.length === 0) {
        console.log("Nothing to fix.");
        process.exit(0);
    }

    // Update all orphaned reports with the given userId
    const result = await interviewReportModel.updateMany(
        { $or: [{ user: null }, { user: { $exists: false } }] },
        { $set: { user: new mongoose.Types.ObjectId(userId) } }
    );

    console.log(`\nFixed ${result.modifiedCount} report(s) → user: ${userId}`);
    process.exit(0);
}

run().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
});
