export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Primeiro tenta servir o asset solicitado
    const asset = await env.ASSETS.fetch(request);

    // Se encontrou, retorna normalmente
    if (asset.status !== 404) {
      return asset;
    }

    // Para rotas da SPA, devolve o index.csr.html
    return env.ASSETS.fetch(new Request(`${url.origin}/index.csr.html`, request));
  },
};