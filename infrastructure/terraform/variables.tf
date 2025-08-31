# Environment-specific configuration files

# Dev environment
variable "dev_config" {
  description = "Development environment configuration"
  type = object({
    project_id     = string
    region         = string
    zone          = string
    domain_suffix = string
  })
  default = {
    project_id     = "dev-tools-suite"
    region         = "us-central1"
    zone          = "us-central1-a"
    domain_suffix = "dev.devtools.site"
  }
}

# Production environment
variable "prd_config" {
  description = "Production environment configuration"
  type = object({
    project_id     = string
    region         = string
    zone          = string
    domain_suffix = string
  })
  default = {
    project_id     = "dev-tools-suite"
    region         = "us-central1"
    zone          = "us-central1-a"
    domain_suffix = "devtools.site"
  }
}