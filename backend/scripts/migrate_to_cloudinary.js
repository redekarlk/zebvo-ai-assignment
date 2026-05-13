import mongoose from 'mongoose';
import Project from '../src/models/Project.js';
import connectDB from '../src/config/db.js';
import { uploadImage } from '../src/services/cloudinary.service.js';

const migrateImages = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Starting migration...');

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to process.`);

    let totalUploaded = 0;
    let totalFailed = 0;

    for (const project of projects) {
      console.log(`\nProcessing project: ${project.name} (${project._id})`);
      let updated = false;

      // Handle main images (hero, about, cta, logo)
      const imageKeys = ['hero', 'about', 'cta', 'logo'];
      for (const key of imageKeys) {
        const image = project.images?.[key];
        if (image?.url && image.url.startsWith('data:')) {
          try {
            console.log(`  Uploading ${key} image...`);
            const result = await uploadImage(image.url, `migration/${project._id}/${key}`);
            if (result?.url) {
              project.images[key].url = result.url;
              updated = true;
              totalUploaded++;
              console.log(`  ✓ ${key} uploaded: ${result.url}`);
            }
          } catch (err) {
            console.error(`  ⨯ Failed to upload ${key}:`, err.message);
            totalFailed++;
          }
        }
      }

      // Handle services images
      if (Array.isArray(project.images?.services)) {
        for (let i = 0; i < project.images.services.length; i++) {
          const service = project.images.services[i];
          if (service?.url && service.url.startsWith('data:')) {
            try {
              console.log(`  Uploading service image ${i + 1}...`);
              const result = await uploadImage(service.url, `migration/${project._id}/services`);
              if (result?.url) {
                project.images.services[i].url = result.url;
                updated = true;
                totalUploaded++;
                console.log(`  ✓ Service ${i + 1} uploaded: ${result.url}`);
              }
            } catch (err) {
              console.error(`  ⨯ Failed to upload service ${i + 1}:`, err.message);
              totalFailed++;
            }
          }
        }
      }

      if (updated) {
        // Use markModified for nested objects if needed, but save() should work here
        project.markModified('images');
        await project.save();
        console.log(`✓ Project ${project._id} updated successfully.`);
      } else {
        console.log(`- No Base64 images found for project ${project._id}.`);
      }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`Total images uploaded: ${totalUploaded}`);
    console.log(`Total uploads failed: ${totalFailed}`);
    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateImages();
