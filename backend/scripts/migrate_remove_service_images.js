/*
Script: migrate_remove_service_images.js
- Connects to MongoDB and removes the 'images.services' field from all projects
- This is a clean sweep to remove unused service image storage
- Usage: node scripts/migrate_remove_service_images.js
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../src/models/Project.js';
import connectDB from '../src/config/db.js';

dotenv.config({ path: process.env.DOTENV_PATH || '.env' });

const main = async () => {
  await connectDB();

  console.log('Starting migration: removing images.services from all projects...');
  
  const result = await Project.updateMany(
    {},
    { $unset: { 'images.services': '' } }
  );

  console.log(`Migration complete:`);
  console.log(`- Matched documents: ${result.matchedCount}`);
  console.log(`- Modified documents: ${result.modifiedCount}`);

  mongoose.disconnect();
};

main().catch(err => {
  console.error('Migration failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
