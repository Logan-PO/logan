resource "aws_iam_role" "worker_role" {
  name = "gha-worker"
  
  description = "Worker role for assumption via GitHub OIDC"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::970547354432:oidc-provider/token.actions.githubusercontent.com"
        },
        Condition = {
            StringEquals = {
                "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            },
            StringLike = {
                "token.actions.githubusercontent.com:sub" = "repo:Logan-PO/logan:*"
            }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "worker_policy" {
  name = "gha-worker-policy"
  role = aws_iam_role.worker_role.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "iam:*"
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = "s3:*"
        Resource = "*"

      },
      {
        Effect = "Allow"
        Action = "s3:ListBucket"
        Resource = "arn:aws:s3:::logan-terraform-state-prod"
      },
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject"]
        Resource = [
            "arn:aws:s3:::logan-terraform-state-prod/*"
        ]
      }
    ]
  })
}
