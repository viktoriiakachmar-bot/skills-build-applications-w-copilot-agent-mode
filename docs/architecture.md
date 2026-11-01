# Architecture Summary & Test Plan

## Tier Boundaries
- Presentation tier decision: React UI application in `octofit-tracker/frontend` running on port 5173
- Logic tier decision: Express API service in `octofit-tracker/backend` running on port 8000
- Data tier decision: Database and seed integration running on port 27017

## Current Failing Tests
- Baseline test failure in Activity tracking endpoint
- Database seed integration test failure

## Smallest Safe Implementation Order
1. Update the activity data model and seed script; validate the seed integration test.
2. Implement Activity tracking, Teams, leaderboard, and Workout suggestions routes; validate the endpoint tests.
3. Connect frontend components to the shared API client with error handling.