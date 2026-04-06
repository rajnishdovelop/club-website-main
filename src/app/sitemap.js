export default function sitemap() {
  const baseUrl = "https://concreate.iiti.ac.in"
  
  // Define static routes
  const routes = [
    "",
    "/team",
    "/projects",
    "/recentActivities",
    "/achievements",
    "/message-us",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }))

  return routes
}
