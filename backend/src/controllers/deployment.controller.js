import deploymentService from '../services/deployment.service.js';

export const deployProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the project belongs to the user
    // (Assuming req.user is populated by auth middleware)
    
    const deployment = await deploymentService.deployLocally(id);
    
    res.status(200).json({
      success: true,
      message: 'Project deployed successfully',
      data: deployment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Deployment failed'
    });
  }
};
