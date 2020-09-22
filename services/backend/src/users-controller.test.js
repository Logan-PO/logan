// users/me returns me
// users/random returns the existing user
// users/nonexistent fails

// createUser succeeds, and returns a good bearer token
// createUser fails if not unique

// updateUser succeeds
// Fails if modifying another usesr
// fails if email and username are not unique

// deleteUser succeeds
// fails if deleting another user
