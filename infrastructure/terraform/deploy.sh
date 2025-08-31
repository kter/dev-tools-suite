#!/bin/bash

# Google Cloud Terraform Deployment Script
# Usage: ./deploy.sh [dev|prd] [plan|apply|destroy]

set -e

ENVIRONMENT=${1:-dev}
ACTION=${2:-plan}

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prd" ]]; then
    echo "Error: Environment must be 'dev' or 'prd'"
    exit 1
fi

if [[ "$ACTION" != "plan" && "$ACTION" != "apply" && "$ACTION" != "destroy" ]]; then
    echo "Error: Action must be 'plan', 'apply', or 'destroy'"
    exit 1
fi

echo "========================================="
echo "🚀 Google Cloud Terraform Deployment"
echo "Environment: $ENVIRONMENT"
echo "Action: $ACTION"
echo "========================================="

# Check if required tools are installed
if ! command -v terraform &> /dev/null; then
    echo "Error: Terraform is not installed"
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo "Error: Google Cloud CLI is not installed"
    exit 1
fi

# Authenticate with Google Cloud
echo "🔐 Authenticating with Google Cloud..."
gcloud auth application-default login

# Set the project
echo "🔧 Setting up Google Cloud project..."
gcloud config set project dev-tools-suite

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Select workspace based on environment
echo "🔧 Selecting Terraform workspace: $ENVIRONMENT"
terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT

# Execute Terraform action
case $ACTION in
    plan)
        echo "📋 Planning Terraform changes..."
        terraform plan -var-file="${ENVIRONMENT}.tfvars" -out="${ENVIRONMENT}.tfplan"
        ;;
    apply)
        echo "🚀 Applying Terraform changes..."
        if [ -f "${ENVIRONMENT}.tfplan" ]; then
            terraform apply "${ENVIRONMENT}.tfplan"
            rm -f "${ENVIRONMENT}.tfplan"
        else
            terraform apply -var-file="${ENVIRONMENT}.tfvars" -auto-approve
        fi
        ;;
    destroy)
        echo "🗑️  Destroying Terraform infrastructure..."
        terraform destroy -var-file="${ENVIRONMENT}.tfvars" -auto-approve
        ;;
esac

echo "========================================="
echo "✅ Terraform $ACTION completed for $ENVIRONMENT environment"
echo "========================================="