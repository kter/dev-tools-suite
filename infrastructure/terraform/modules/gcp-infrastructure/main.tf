terraform {
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
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
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
}

# Enable required APIs
resource "google_project_service" "firebase_api" {
  service = "firebase.googleapis.com"
}

resource "google_project_service" "firebase_hosting_api" {
  service = "firebasehosting.googleapis.com"
}

# Initialize Firebase project (using google-beta provider)
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id
  
  depends_on = [
    google_project_service.firebase_api
  ]
}

# Create Firebase Hosting sites for each tool (using google-beta provider)  
resource "google_firebase_hosting_site" "tool_sites" {
  provider = google-beta
  for_each = toset(local.tools)
  
  project = var.project_id
  site_id = "devtools-${each.value}-${var.environment}"
  
  depends_on = [
    google_firebase_project.default,
    google_project_service.firebase_hosting_api
  ]
}

# Create Firebase Hosting site for landing page
resource "google_firebase_hosting_site" "landing_site" {
  provider = google-beta
  project  = var.project_id
  site_id  = "devtools-landing-page-${var.environment}"
  
  depends_on = [
    google_firebase_project.default,
    google_project_service.firebase_hosting_api
  ]
}