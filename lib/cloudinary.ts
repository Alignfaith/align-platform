// This file is no longer used. All photo uploads have been migrated to Supabase Storage.
// See lib/storage.ts for the current upload utility.
//
// TODO (follow-up): delete this file and run `npm uninstall cloudinary` once confirmed
// that no Cloudinary URLs remain in the production database (Photo.url, AlignmentStory.photoUrl,
// MatchingApplication.photoUrl). After migration is verified stable, those rows can be
// re-uploaded or left as-is (Cloudinary URLs remain valid until the account is removed).
