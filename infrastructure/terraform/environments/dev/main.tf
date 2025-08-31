terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
  
  backend "gcs" {
    bucket = "dev-tools-suite-terraform-state"
    prefix = "terraform/dev"
  }
}

# Use the shared module
module "dev_tools_gcp" {
  source = "../../modules/gcp-infrastructure"
  
  project_id    = "dev-tools-suite"
  region        = "us-central1"
  zone          = "us-central1-a"
  environment   = "dev"
  domain_suffix = "dev.devtools.site"
}

# Outputs
output "firebase_hosting_sites" {
  description = "Map of tool names to Firebase Hosting site IDs"
  value       = module.dev_tools_gcp.firebase_hosting_sites
}

output "landing_site_id" {
  description = "Firebase Hosting site ID for landing page"
  value       = module.dev_tools_gcp.landing_site_id
}

output "firebase_hosting_urls" {
  description = "Map of tool names to default Firebase Hosting URLs"
  value       = module.dev_tools_gcp.firebase_hosting_urls
}

output "landing_url" {
  description = "Default Firebase Hosting URL for landing page"
  value       = module.dev_tools_gcp.landing_url
}

output "custom_domains" {
  description = "Map of tool names to custom domains"
  value       = module.dev_tools_gcp.custom_domains
}

output "landing_custom_domain" {
  description = "Custom domain for landing page"  
  value       = module.dev_tools_gcp.landing_custom_domain
}