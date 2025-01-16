import {
    to = aws_s3_bucket.terraform_state_bucket
    id = "arn:aws:s3:::logan-terraform-state-prod"
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket = "logan-terraform-state-prod"
}

resource "aws_s3_bucket_public_access_block" "terraform_state_access_block" {
  bucket = aws_s3_bucket.terraform_state_bucket

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
