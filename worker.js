export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Buyer questionnaire bot is running");
    }

    return new Response("ok");
  }
};
