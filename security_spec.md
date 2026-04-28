# Firestore Security Specification - 15 Puzzle Matrix

## 1. Data Invariants
- A user can only write to their own profile in `/users/{userId}`.
- A game history record in `/games/{userId}/history/{gameId}` must always have the `userId` field matching the `userId` in the path and the authenticated user's UID.
- Leaderboard entries can only be created or updated by the user whose `userId` matches the entry.
- Leaderboard entries for a specific `mode` collection must have the `mode` field matching the collection ID.

## 2. Dirty Dozen Payloads (Rejection Tests)

1. **Identity Spoofing**: Attempt to update another user's profile.
   - Path: `/users/target_uid` | Payload: `{ "displayName": "Attacker" }` | Auth: `attacker_uid`
2. **Path Variable Poisoning**: Attempt to use an extremely long string for `userId`.
   - Path: `/users/0123456789... (1KB string)`
3. **Ghost Field Injection**: Add `isAdmin: true` to a user profile update.
4. **State Shortcutting**: Directly update `level` to 999. (Allowed in this app for now, but usually restricted. In this app, we'll restrict it to specific increments if we were stricter, but for now we validate the schema).
5. **PII Blanket Read**: Attempt to list all users.
6. **Orphaned Writes**: Create a leaderboard entry with a mode that doesn't match the collection.
7. **Timestamp Spoofing**: Send a client-side timestamp instead of `request.time`.
8. **Invalid Operations**: Attempt to delete a game history record.
9. **Relational Sync Failure**: Create a game history for a user that doesn't exist in `/users`. (We check identity match, existence of user profile is implied by the flow).
10. **Query Scraping**: Attempt a list query on `/leaderboard` without filters (Rules should enforce list logic).
11. **Resource Exhaustion**: Send a 1MB string for `displayName`.
12. **Immutable Field Change**: Attempt to change `userId` after creation in a leaderboard entry.

## 3. Test Runner Logic (Conceptual)
All the above must return `PERMISSION_DENIED`.
