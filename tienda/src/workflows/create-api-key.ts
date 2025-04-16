import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";





const createApiKeyStep = createStep(
  "create-api-key",

  async ({}, { container }) => {

    const apiKeyModuleService = container.resolve(Modules.API_KEY);


    
    const apiKey = await apiKeyModuleService.createApiKeys({
      title: "Publishable API key",
      type: "publishable",
      created_by: "user_123",
    });

    

    return new StepResponse({ apiKey }, apiKey.id);
  },


  async (apiKeyId, { container }) => {
    if (!apiKeyId) {
      throw new Error("API Key ID is undefined");
    }
  
    const apiKeyModuleService = container.resolve(Modules.API_KEY);
  
    await apiKeyModuleService.deleteApiKeys([apiKeyId]);
  }


);






export const createApiKeyWorkflow = createWorkflow("create-api-key", () => {
    
  const { apiKey } = createApiKeyStep();

  return new WorkflowResponse({apiKey});


});
