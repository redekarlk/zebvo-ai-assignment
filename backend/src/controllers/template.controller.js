import Template from '../models/Template.js';

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find()
      .select('-__v')
      .sort({ isPopular: -1, order: 1 });
    
    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
    });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching template:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
    });
  }
};

export const getTemplateBySlug = async (req, res) => {
  try {
    const template = await Template.findOne({ slug: req.params.slug });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching template:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
    });
  }
};
