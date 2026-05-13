import exportService from '../services/export.service.js';
import Project from '../models/Project.js';

/**
 * Validates ownership and fetches the project
 */
const getProjectForExport = async (projectId, user) => {
  try {
    // Robustly extract user ID from the user object
    const userId = user?._id || user?.id || user;
    console.log(`[Export Controller] Fetching project ${projectId} for user ${userId}`);
    
    const project = await Project.findOne({ _id: projectId, user: userId });
    
    if (!project) {
      console.error(`[Export Controller] Project ${projectId} not found for user ${userId}`);
      throw new Error('Project not found or unauthorized');
    }
    
    return project;
  } catch (error) {
    console.error(`[Export Controller] getProjectForExport error:`, error.message);
    throw error;
  }
};

export const exportHTML = async (req, res) => {
  try {
    const project = await getProjectForExport(req.params.projectId, req.user);
    
    if (!project.sections || project.sections.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project has no sections to export' 
      });
    }

    const html = exportService.generateHTML(project.toObject());
    
    if (!html || html.trim().length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate HTML content' 
      });
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name || 'website'}.html"`);
    res.status(200).send(html);
  } catch (error) {
    console.error('[Export Controller] HTML export error:', error.message);
    res.status(error.message.includes('not found') ? 404 : 500).json({ 
      success: false, 
      message: error.message || 'Failed to export HTML' 
    });
  }
};

export const exportPreviewHTML = async (req, res) => {
  try {
    const project = req.body?.project;

    if (!project || !Array.isArray(project.sections) || project.sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project payload with sections is required'
      });
    }

    const html = exportService.generateHTML(project);

    const inertClickShield = `<script>(function(){function blockInteractiveClicks(event){var target=event.target && event.target.closest && event.target.closest('a,button,[role="button"]');if(!target)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();}document.addEventListener('click',blockInteractiveClicks,true);document.addEventListener('mousedown',blockInteractiveClicks,true);document.addEventListener('mouseup',blockInteractiveClicks,true);})();</script>`;
    const previewHtml = typeof html === 'string' && html.includes('</body>')
      ? html.replace('</body>', `${inertClickShield}</body>`)
      : `${html}${inertClickShield}`;

    if (!html || html.trim().length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate HTML preview content'
      });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(previewHtml);
  } catch (error) {
    console.error('[Export Controller] HTML preview error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate HTML preview'
    });
  }
};

export const exportJSON = async (req, res) => {
  try {
    const project = await getProjectForExport(req.params.projectId, req.user.id);
    
    if (!project) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project data is empty' 
      });
    }

    const json = exportService.generateJSON(project.toObject());
    
    if (!json || json.trim().length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate JSON' 
      });
    }
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name || 'project'}-data.json"`);
    res.status(200).send(json);
  } catch (error) {
    console.error('[Export Controller] JSON export error:', error.message);
    res.status(error.message.includes('not found') ? 404 : 500).json({ 
      success: false, 
      message: error.message || 'Failed to export JSON' 
    });
  }
};

export const exportZIP = async (req, res) => {
  try {
    const project = await getProjectForExport(req.params.projectId, req.user.id);
    
    if (!project.sections || project.sections.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project has no sections to export' 
      });
    }

    const zipStream = await exportService.generateZIP(project.toObject());
    
    if (!zipStream) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate ZIP archive' 
      });
    }
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name || 'website'}.zip"`);
    
    // Pipe the archive stream to the response
    zipStream.pipe(res);
    
    zipStream.on('error', (error) => {
      console.error('[Export Controller] ZIP stream error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          message: 'Error during ZIP generation' 
        });
      }
    });
  } catch (error) {
    console.error('[Export Controller] ZIP export error:', error.message);
    res.status(error.message.includes('not found') ? 404 : 500).json({ 
      success: false, 
      message: error.message || 'Failed to export ZIP' 
    });
  }
};
