# Variables
variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "The Google Cloud region"
  type        = string
}

variable "zone" {
  description = "The Google Cloud zone"
  type        = string
}

variable "environment" {
  description = "Environment (dev or prd)"
  type        = string
}

variable "domain_suffix" {
  description = "Domain suffix for the environment"
  type        = string
}