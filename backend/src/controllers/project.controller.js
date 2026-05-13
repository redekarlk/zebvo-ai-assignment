import Project from '../models/Project.js';
import Template from '../models/Template.js';
import asyncHandler from '../utils/asyncHandler.js';
import { normalizeDesignTheme } from '../utils/designSystem.js';

// Deep clone function for objects to prevent reference sharing
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));


export const createProject = asyncHandler(async (req, res) => {
  const { name, businessInfo, templateId, templateSlug } = req.body;

  // Fetch template if provided
  let template = null;
  if (templateId) {
    template = await Template.findById(templateId);
  } else if (templateSlug) {
    template = await Template.findOne({ slug: templateSlug });
  }

  // Build project data
  const projectData = {
    user: req.user._id,
    name: name || 'Untitled Project',
    businessInfo: businessInfo || {},
    template: template ? template._id : undefined,
  };

  // If template exists, populate sections and theme from template
  if (template) {
    // Deep clone sections to avoid shared references between projects
    projectData.sections = template.sections.map(s => ({
      id: s.id,
      type: s.type,
      order: s.order,
      visible: s.visible,
      props: deepClone(s.props), // Deep clone to prevent reference sharing
    }));
    projectData.theme = normalizeDesignTheme(deepClone(template.theme));
  } else {
    // Default empty sections if no template
    projectData.sections = [];
    projectData.theme = normalizeDesignTheme();
  }

  const project = await Project.create(projectData);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project,
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: projects,
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    data: project,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});

export const publishProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Generate a basic slug if one doesn't exist
  if (!project.slug) {
    const baseSlug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const randomString = Math.random().toString(36).substring(2, 8);
    project.slug = `${baseSlug}-${randomString}`;
  }

  project.status = 'published';
  await project.save();

  res.json({
    success: true,
    message: 'Project published successfully',
    data: {
      slug: project.slug,
      status: project.status,
      publicUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/preview/${project.slug}`
    }
  });
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    status: 'published'
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found or not published',
    });
  }

  res.json({
    success: true,
    data: project,
  });
});