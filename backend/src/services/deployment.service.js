import fs from 'fs';
import path from 'path';
import { generateHTML } from '../utils/htmlGenerator.js';
import Project from '../models/Project.js';

const toSlug = (value = '') => String(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

class DeploymentService {
  /**
   * Deploy project to local static hosting
   * @param {string} projectId 
   */
  async deployLocally(projectId) {
    try {
      const project = await Project.findById(projectId);
      if (!project) throw new Error('Project not found');

      // Update status to deploying
      project.deployment.status = 'deploying';
      await project.save();

      // Generate the final HTML
      const htmlContent = generateHTML(project.toObject());

      const projectSlug = toSlug(project.name) || project._id.toString();

      // Create deployment directory
      const deployDir = path.join(process.cwd(), 'public', 'sites', projectSlug);
      if (!fs.existsSync(deployDir)) {
        fs.mkdirSync(deployDir, { recursive: true });
      }

      // Save the file
      const filePath = path.join(deployDir, 'index.html');
      fs.writeFileSync(filePath, htmlContent);

      // Construct live URL
      // Use process.env.BASE_URL or fallback to localhost
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
      const liveUrl = `${baseUrl}/sites/${projectSlug}/index.html`;

      // Update project with deployment details
      project.slug = projectSlug;
      project.deployment = {
        status: 'live',
        liveUrl,
        lastDeployedAt: new Date(),
        deploymentId: `local-${Date.now()}`
      };
      
      project.status = 'published';
      await project.save();

      return project.deployment;
    } catch (error) {
      console.error('[DeploymentService] Error:', error);
      
      // Update status to failed
      await Project.findByIdAndUpdate(projectId, {
        'deployment.status': 'failed'
      });
      
      throw error;
    }
  }
}

export default new DeploymentService();
