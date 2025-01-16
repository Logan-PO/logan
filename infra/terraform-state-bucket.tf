import {
  to = aws_s3_bucket.terraform_state_bucket
  id = "logan-terraform-state-prod"
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket = "logan-terraform-state-prod"
  region = "us-west-2"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_bucket_encryption" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "terraform_state_bucket_versioning" {
  bucket = aws_s3_bucket.terraform_state_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_ownership_controls" "terraform_state_ownership_controls" {
  bucket = aws_s3_bucket.terraform_state_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state_access_block" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_acl" "terraform_state_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.terraform_state_ownership_controls,
    aws_s3_bucket_public_access_block.terraform_state_access_block,
  ]

  bucket = aws_s3_bucket.terraform_state_bucket.id
  acl    = "private"
}
