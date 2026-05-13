import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// Fix private key formatting (convert \n strings to actual newlines)
const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

const vertexAI = new VertexAI({
  project: project,
  location: location,
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
      project_id: project
    }
  }
});

export default vertexAI;