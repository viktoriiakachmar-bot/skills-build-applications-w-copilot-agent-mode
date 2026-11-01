# Architecture Summary & Test Plan

## Tier Boundaries
- Frontend: React UI application located in `octofit-tracker/frontend`
- Backend: Express API service located in `octofit-tracker/backend`

## Current Failing Tests
- Baseline test failure in user activity logging endpoint
- Database seed integration test failure

## Smallest Safe Changes
- Update activity data model and seed script
- Implement missing routes for activity logging, leaderboard, and workout suggestions
- Connect frontend components to shared API client with error handling