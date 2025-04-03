import apiClient from "./api";

export interface CodeBlock {
    _id: string;
    code: string;
    title: string;
    solution: string;
}

const getAllCodeBlocks = () => {
    const controller = new AbortController();
    const request = apiClient.get<CodeBlock[]>(`/codeBlocks/all`, {
      signal: controller.signal
    });
    
    return { request, cancel: () => controller.abort() };
  };
  
  const getCodeBlockById = (id :string) => {
    const controller = new AbortController();
    const request = apiClient.get<CodeBlock>(`/codeBlocks/${id}`, {
      signal: controller.signal
    });
    
    return { request, cancel: () => controller.abort() };
  };


const createCodeBlock = (newCodeBlock: CodeBlock) => {
    const controller = new AbortController();
    const request = apiClient.post< CodeBlock >("/codeBlocks", newCodeBlock, {
      signal: controller.signal,
    });
  
    return { request, cancel: () => controller.abort() };
  };

  const updateCodeBlock = (id: string, updatedCodeBlock: CodeBlock) => {
    const controller = new AbortController();
    const request = apiClient.put<CodeBlock>(`/codeBlocks/${id}`, updatedCodeBlock, {
      signal: controller.signal,
    });
  
    return { request, cancel: () => controller.abort() };
  };

  const deleteCodeBlock = (id: string) => {
    const controller = new AbortController();
    const request = apiClient.delete<string>(`/codeBlocks/${id}`, {
      signal: controller.signal,
    });
  
    return { request, cancel: () => controller.abort() };
  };
  
  export {
    getAllCodeBlocks,
    getCodeBlockById,
    createCodeBlock,
    updateCodeBlock,
    deleteCodeBlock,
  };