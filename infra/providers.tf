terraform {
  required_version = ">= 1.5.1"

  required_providers {
      aws = {
      source  = "hashicorp/aws"
      version = ">= 5.5.0"
    }
  }
    
  backend "s3" {
    role_arn       = "arn:aws:iam::970547354432:role/gha-worker"
    bucket         = "logan-terraform-state-prod"
    key            = "prod/terraform.tfstate"
    region         = "us-west-2"
  }
}
