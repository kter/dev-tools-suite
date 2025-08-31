# Outputs for Firebase Hosting
output "firebase_hosting_sites" {
  description = "Map of tool names to Firebase Hosting site IDs"
  value       = {
    for tool in local.tools :
    tool => google_firebase_hosting_site.tool_sites[tool].site_id
  }
}

output "landing_site_id" {
  description = "Firebase Hosting site ID for landing page"
  value       = google_firebase_hosting_site.landing_site.site_id
}

output "firebase_hosting_urls" {
  description = "Map of tool names to default Firebase Hosting URLs"
  value       = {
    for tool in local.tools :
    tool => "https://devtools-${tool}-${var.environment}.web.app"
  }
}

output "landing_url" {
  description = "Default Firebase Hosting URL for landing page"
  value       = "https://devtools-landing-page-${var.environment}.web.app"
}

output "custom_domains" {
  description = "Map of tool names to custom domains"
  value       = {
    for tool in local.tools :
    tool => "${tool}.${var.domain_suffix}"
  }
}

output "landing_custom_domain" {
  description = "Custom domain for landing page"
  value       = var.domain_suffix
}