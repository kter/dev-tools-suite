terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  backend "gcs" {
    bucket = "dev-tools-suite-terraform-state"
    prefix = "terraform/prd"
  }
}

# Use the shared module
module "dev_tools_gcp" {
  source = "../../modules/gcp-infrastructure"
  
  project_id    = "dev-tools-suite"
  region        = "us-central1"
  zone          = "us-central1-a"
  environment   = "prd"
  domain_suffix = "devtools.site"
}

# Outputs
output "load_balancer_ip" {
  description = "The IP address of the load balancer"
  value       = module.dev_tools_gcp.load_balancer_ip
}

output "ssl_certificate_id" {
  description = "The ID of the SSL certificate"
  value       = module.dev_tools_gcp.ssl_certificate_id
}

output "bucket_names" {
  description = "Map of tool names to bucket names"
  value       = module.dev_tools_gcp.bucket_names
}

output "landing_bucket_name" {
  description = "Landing page bucket name"
  value       = module.dev_tools_gcp.landing_bucket_name
}