# Bootstrap and build
npm run bootstrap
cd services/frontend
npm run build

# Sync the S3 bucket with the local public folder
aws s3 sync public s3://logan-frontend/ --delete

# Enable public read access to the site
aws s3api put-object-acl --acl public-read --bucket logan-frontend --key index.html
