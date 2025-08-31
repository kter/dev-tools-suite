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
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Variables
variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
  default     = "dev-tools-suite"
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The Google Cloud zone"
  type        = string
  default     = "us-central1-a"
}

variable "environment" {
  description = "Environment (dev or prd)"
  type        = string
  default     = "dev"
}

variable "domain_suffix" {
  description = "Domain suffix for the environment"
  type        = string
  default     = "dev.devtools.site"
}

# Local values for tool names
locals {
  tools = [
    "hash-generator",
    "qr-generator", 
    "unix-time-converter",
    "password-generator",
    "ip-calculator",
    "markdown-preview",
    "placeholder-generator",
    "ip-info",
    "timezone-converter",
    "string-converter",
    "code-diff",
    "mic-test",
    "json-yaml-converter",
    "jwt-decoder",
    "regex-tester",
    "lorem-ipsum-generator",
    "image-converter",
    "timer",
    "character-code-converter",
    "badger-image-generator",
    "poster-splitter"
  ]
  
  # Create bucket names with environment suffix
  bucket_names = {
    for tool in local.tools : 
    tool => "${tool}-${replace(var.domain_suffix, ".", "-")}"
  }
  
  # Landing page bucket
  landing_bucket_name = "landing-page-${replace(var.domain_suffix, ".", "-")}"
}

# Enable required APIs
resource "google_project_service" "compute_api" {
  service = "compute.googleapis.com"
}

resource "google_project_service" "storage_api" {
  service = "storage.googleapis.com"
}

resource "google_project_service" "dns_api" {
  service = "dns.googleapis.com"
}

# Reserve static IP address for load balancer
resource "google_compute_global_address" "lb_ip" {
  name = "dev-tools-lb-ip-${var.environment}"
  
  depends_on = [google_project_service.compute_api]
}

# SSL certificate
resource "google_compute_managed_ssl_certificate" "ssl_cert" {
  name = "dev-tools-ssl-cert-${var.environment}"
  
  managed {
    domains = concat(
      [for tool in local.tools : "${tool}.${var.domain_suffix}"],
      [var.domain_suffix] # Landing page domain
    )
  }
  
  depends_on = [google_project_service.compute_api]
}

# Storage buckets for each tool
resource "google_storage_bucket" "tool_buckets" {
  for_each = local.bucket_names
  
  name     = each.value
  location = var.region
  
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  
  depends_on = [google_project_service.storage_api]
}

# Landing page bucket
resource "google_storage_bucket" "landing_bucket" {
  name     = local.landing_bucket_name
  location = var.region
  
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  
  depends_on = [google_project_service.storage_api]
}

# Make buckets publicly readable
resource "google_storage_bucket_iam_member" "tool_bucket_public_read" {
  for_each = google_storage_bucket.tool_buckets
  
  bucket = each.value.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_storage_bucket_iam_member" "landing_bucket_public_read" {
  bucket = google_storage_bucket.landing_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Backend services for each tool
resource "google_compute_backend_bucket" "tool_backends" {
  for_each = google_storage_bucket.tool_buckets
  
  name        = "backend-${replace(each.key, "-", "")}-${var.environment}"
  bucket_name = each.value.name
  enable_cdn  = true
  
  cdn_policy {
    cache_mode  = "CACHE_ALL_STATIC"
    default_ttl = 3600
    max_ttl     = 86400
  }
  
  depends_on = [google_project_service.compute_api]
}

# Backend service for landing page
resource "google_compute_backend_bucket" "landing_backend" {
  name        = "backend-landing-${var.environment}"
  bucket_name = google_storage_bucket.landing_bucket.name
  enable_cdn  = true
  
  cdn_policy {
    cache_mode  = "CACHE_ALL_STATIC"
    default_ttl = 3600
    max_ttl     = 86400
  }
  
  depends_on = [google_project_service.compute_api]
}

# URL map for routing
resource "google_compute_url_map" "url_map" {
  name            = "dev-tools-url-map-${var.environment}"
  default_service = google_compute_backend_bucket.landing_backend.id
  
  dynamic "host_rule" {
    for_each = local.tools
    content {
      hosts        = ["${host_rule.value}.${var.domain_suffix}"]
      path_matcher = "path-matcher-${replace(host_rule.value, "-", "")}"
    }
  }
  
  dynamic "path_matcher" {
    for_each = local.tools
    content {
      name            = "path-matcher-${replace(path_matcher.value, "-", "")}"
      default_service = google_compute_backend_bucket.tool_backends[path_matcher.value].id
    }
  }
  
  depends_on = [google_project_service.compute_api]
}

# HTTPS proxy
resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "dev-tools-https-proxy-${var.environment}"
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_cert.id]
  
  depends_on = [google_project_service.compute_api]
}

# Global forwarding rule
resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name       = "dev-tools-https-forwarding-rule-${var.environment}"
  target     = google_compute_target_https_proxy.https_proxy.id
  port_range = "443"
  ip_address = google_compute_global_address.lb_ip.address
  
  depends_on = [google_project_service.compute_api]
}

# HTTP to HTTPS redirect
resource "google_compute_url_map" "http_redirect" {
  name = "dev-tools-http-redirect-${var.environment}"
  
  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
  
  depends_on = [google_project_service.compute_api]
}

resource "google_compute_target_http_proxy" "http_proxy" {
  name    = "dev-tools-http-proxy-${var.environment}"
  url_map = google_compute_url_map.http_redirect.id
  
  depends_on = [google_project_service.compute_api]
}

resource "google_compute_global_forwarding_rule" "http_forwarding_rule" {
  name       = "dev-tools-http-forwarding-rule-${var.environment}"
  target     = google_compute_target_http_proxy.http_proxy.id
  port_range = "80"
  ip_address = google_compute_global_address.lb_ip.address
  
  depends_on = [google_project_service.compute_api]
}

# Outputs
output "load_balancer_ip" {
  description = "The IP address of the load balancer"
  value       = google_compute_global_address.lb_ip.address
}

output "ssl_certificate_id" {
  description = "The ID of the SSL certificate"
  value       = google_compute_managed_ssl_certificate.ssl_cert.id
}

output "bucket_names" {
  description = "Map of tool names to bucket names"
  value       = {
    for tool in local.tools :
    tool => google_storage_bucket.tool_buckets[tool].name
  }
}

output "landing_bucket_name" {
  description = "Landing page bucket name"
  value       = google_storage_bucket.landing_bucket.name
}